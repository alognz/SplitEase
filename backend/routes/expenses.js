const { Expense, User, Activity } = require('../models');
const auth = require('../shared/auth');
const groupMember = require('../shared/groupMember');
const { validateSplits, validateSplitMembers } = require('../utils/validation');

module.exports = function(router) {
  
  const formatExpense = async function(expense) {
    await expense.populate('paidBy', '_id username');
    
    const splitsWithUsernames = await Promise.all(
      expense.splits.map(async function(split) {
        const user = await User.findById(split.userId).select('username');
        return {
          userId: split.userId,
          username: user?.username || 'Unknown',
          amount: split.amount
        };
      })
    );

    return {
      id: expense._id,
      groupId: expense.groupId,
      name: expense.name,
      amount: expense.amount,
      paidBy: {
        id: expense.paidBy._id,
        username: expense.paidBy.username
      },
      splits: splitsWithUsernames,
      createdBy: expense.createdBy,
      createdAt: expense.createdAt
    };
  };

  router.get('/groups/:groupId/expenses/balances', auth, groupMember, async function(req, res) {
    try {
      const expenses = await Expense.find({ groupId: req.group._id });
      
      const balances = {};
      
      for (const memberId of req.group.members) {
        balances[memberId.toString()] = 0;
      }

      for (const expense of expenses) {
        balances[expense.paidBy.toString()] += expense.amount;
        
        for (const split of expense.splits) {
          balances[split.userId.toString()] -= split.amount;
        }
      }

      await req.group.populate('members', '_id username');
      
      const balancesList = req.group.members.map(function(member) {
        return {
          userId: member._id,
          username: member.username,
          balance: balances[member._id.toString()] || 0
        };
      });

      res.json({ balances: balancesList });
    } catch (error) {
      res.status(500).json({
        error: 'error calculating balances',
      });
    }
  });

  router.post('/groups/:groupId/expenses', auth, groupMember, async function(req, res) {
    try {
      const { name, amount, paidBy, splits } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'need name'
        });
      }
      if (!amount || amount <= 0) {
        return res.status(400).json({
          error: 'Amount must be in positive cents'
        });
      }
      if (!paidBy) {
        return res.status(400).json({
          error: 'need paidBy'
        });
      }
      if (!splits || !Array.isArray(splits)) {
        return res.status(400).json({
          error: 'need splits'
        });
      }

      const splitsValidation = validateSplits(splits, amount);
      if (!splitsValidation.valid) {
        return res.status(400).json({
          error: splitsValidation.message
        });
      }

      const memberValidation = validateSplitMembers(splits, req.group.members);
      if (!memberValidation.valid) {
        return res.status(400).json({
          error: memberValidation.message,
        });
      }

      if (!req.group.members.some(function(m) { return m.toString() === paidBy; })) {
        return res.status(400).json({
          error: 'Payer needs to be in group'
        });
      }

      const expense = new Expense({
        groupId: req.group._id,
        name,
        amount,
        paidBy,
        splits,
        createdBy: req.user._id
      });
      await expense.save();

      await Activity.log(req.group._id, 'expense_added', req.user._id, {
        expenseId: expense._id,
        name: expense.name,
        amount: expense.amount
      });

      const formatted = await formatExpense(expense);
      res.status(201).json(formatted);
    } catch (error) {
      res.status(500).json({
        error: 'error creating expense'
      });
    }
  });

  router.get('/groups/:groupId/expenses', auth, groupMember, async function(req, res) {
    try {
      const expenses = await Expense.find({ groupId: req.group._id })
        .sort({ createdAt: -1 });

      const formatted = await Promise.all(
        expenses.map(function(expense) {
          return formatExpense(expense);
        })
      );

      res.json({ expenses: formatted });
    } catch (error) {
      res.status(500).json({
        error: 'error getting expenses'
      });
    }
  });

  router.get('/groups/:groupId/expenses/:expenseId', auth, groupMember, async function(req, res) {
    try {
      const expense = await Expense.findOne({
        _id: req.params.expenseId,
        groupId: req.group._id
      });

      if (!expense) {
        return res.status(404).json({
          error: 'Expense dne',
        });
      }

      const formatted = await formatExpense(expense);
      res.json(formatted);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(404).json({
          error: 'Expense dne',
        });
      }
      res.status(500).json({
        error: 'error getting expense',
      });
    }
  });

  router.patch('/groups/:groupId/expenses/:expenseId', auth, groupMember, async function(req, res) {
    try {
      const expense = await Expense.findOne({
        _id: req.params.expenseId,
        groupId: req.group._id
      });

      if (!expense) {
        return res.status(404).json({
          error: 'Expense dne'
        });
      }

      const { name, amount, paidBy, splits } = req.body;

      if (name) expense.name = name;
      if (paidBy) expense.paidBy = paidBy;
      
      const newAmount = amount || expense.amount;
      const newSplits = splits || expense.splits;

      if (amount || splits) {
        const splitsValidation = validateSplits(newSplits, newAmount);
        if (!splitsValidation.valid) {
          return res.status(400).json({
            error: splitsValidation.message
          });
        }

        const memberValidation = validateSplitMembers(newSplits, req.group.members);
        if (!memberValidation.valid) {
          return res.status(400).json({
            error: memberValidation.message,
          });
        }

        expense.amount = newAmount;
        expense.splits = newSplits;
      }

      await expense.save();

      await Activity.log(req.group._id, 'expense_updated', req.user._id, {
        expenseId: expense._id,
        name: expense.name
      });

      const formatted = await formatExpense(expense);
      res.json(formatted);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(404).json({
          error: 'Expense dne'
        });
      }
      res.status(500).json({
        error: 'error updating expense'
      });
    }
  });

  router.delete('/groups/:groupId/expenses/:expenseId', auth, groupMember, async function(req, res) {
    try {
      const expense = await Expense.findOne({
        _id: req.params.expenseId,
        groupId: req.group._id
      });

      if (!expense) {
        return res.status(404).json({
          error: 'Expense dne'
        });
      }

      await Activity.log(req.group._id, 'expense_deleted', req.user._id, {
        name: expense.name,
        amount: expense.amount
      });

      await Expense.findByIdAndDelete(expense._id);

      res.json({
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(404).json({
          error: 'Expense dne',
        });
      }
      res.status(500).json({
        error: 'error deleting expense',
      });
    }
  });

  return router;
};