const { Chore, User, Activity } = require('../models');
const auth = require('../shared/auth');
const groupMember = require('../shared/groupMember');
const { validateColor } = require('../utils/validation');

module.exports = function(router) {

  const formatChore = async function(chore) {
    const assignedUser = await User.findById(chore.assignedTo).select('_id username');
    
    return {
      id: chore._id,
      groupId: chore.groupId,
      name: chore.name,
      assignedTo: {
        id: assignedUser?._id || chore.assignedTo,
        username: assignedUser?.username || 'Unknown'
      },
      dueDate: chore.dueDate,
      color: chore.color,
      completed: chore.completed,
      completedAt: chore.completedAt,
      createdBy: chore.createdBy,
      createdAt: chore.createdAt
    };
  };

  router.post('/groups/:groupId/chores', auth, groupMember, async function(req, res) {
    try {
      const { name, assignedTo, dueDate, color } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'need name'
        });
      }
      if (!assignedTo) {
        return res.status(400).json({
          error: 'need assignedTo'
        });
      }
      if (!dueDate) {
        return res.status(400).json({
          error: 'need dueDate'
        });
      }

      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          error: 'Incorrect duedate'
        });
      }

      if (!req.group.members.some(function(m) { return m.toString() === assignedTo; })) {
        return res.status(400).json({
          error: 'Assigned user not in group'
        });
      }

      if (color && !validateColor(color)) {
        return res.status(400).json({
          error: 'use hex code for color'
        });
      }

      const assignedUser = await User.findById(assignedTo).select('username');

      const chore = new Chore({
        groupId: req.group._id,
        name,
        assignedTo,
        dueDate: parsedDate,
        color: color || '#4CAF50',
        createdBy: req.user._id
      });
      await chore.save();

      await Activity.log(req.group._id, 'chore_added', req.user._id, {
        choreId: chore._id,
        name: chore.name,
        assignedTo: assignedUser?.username || 'Unknown'
      });

      const formatted = await formatChore(chore);
      res.status(201).json(formatted);
    } catch (error) {
      res.status(500).json({
        error: 'whoopsie couldnt create chore'
      });
    }
  });

  router.get('/groups/:groupId/chores', auth, groupMember, async function(req, res) {
    try {
      const chores = await Chore.find({ groupId: req.group._id })
        .sort({ dueDate: 1 });

      const formatted = await Promise.all(
        chores.map(function(chore) {
          return formatChore(chore);
        })
      );

      res.json({ chores: formatted });
    } catch (error) {
      console.error('bad get chores: ', error);
      res.status(500).json({
        error: 'couldnt get chores'
      });
    }
  });

  router.patch('/groups/:groupId/chores/:choreId', auth, groupMember, async function(req, res) {
    try {
      const chore = await Chore.findOne({
        _id: req.params.choreId,
        groupId: req.group._id
      });

      if (!chore) {
        return res.status(404).json({
          error: 'couldnt find chore'
        });
      }

      const { name, assignedTo, dueDate, color, completed } = req.body;

      if (name) chore.name = name;
      
      if (assignedTo) {
        if (!req.group.members.some(function(m) { return m.toString() === assignedTo; })) {
          return res.status(400).json({
            error: 'Assigned user needs to be in group'
          });
        }
        chore.assignedTo = assignedTo;
      }

      if (dueDate) {
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            error: 'bad date format'
          });
        }
        chore.dueDate = parsedDate;
      }

      if (color) {
        if (!validateColor(color)) {
          return res.status(400).json({
            error: 'Use hex code for colors'
          });
        }
        chore.color = color;
      }

      if (typeof completed === 'boolean') {
        const wasCompleted = chore.completed;
        chore.completed = completed;
        
        if (completed && !wasCompleted) {
          chore.completedAt = new Date();
          
          await Activity.log(req.group._id, 'chore_completed', req.user._id, {
            choreId: chore._id,
            name: chore.name
          });
        } else if (!completed) {
          chore.completedAt = null;
        }
      }

      await chore.save();

      const formatted = await formatChore(chore);
      res.json(formatted);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(404).json({
          error: 'Chore not found'
        });
      }
      console.error('Update chore error:', error);
      res.status(500).json({
        error: 'couldnt update chore'
      });
    }
  });

  router.delete('/groups/:groupId/chores/:choreId', auth, groupMember, async function(req, res) {
    try {
      const chore = await Chore.findOne({
        _id: req.params.choreId,
        groupId: req.group._id
      });

      if (!chore) {
        return res.status(404).json({
          error: 'Chore not found',
        });
      }

      await Activity.log(req.group._id, 'chore_deleted', req.user._id, {
        name: chore.name
      });

      await Chore.findByIdAndDelete(chore._id);

      res.json({
        message: 'Chore deleted yay'
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(404).json({
          error: 'Chore not found',
        });
      }
      console.error('bad chore delete:', error);
      res.status(500).json({
        error: 'couldnt delete chore'
      });
    }
  });

  return router;
};