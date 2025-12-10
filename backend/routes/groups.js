const { Group, User, Expense, Chore, Activity } = require('../models');
const auth = require('../shared/auth');
const groupMember = require('../shared/groupMember');

module.exports = function(router) {
  router.post('/groups', auth, async function(req, res) {
    try {
      const { name, memberUsernames = [] } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'needs name'
        });
      }

      const members = [req.user._id];

      for (const username of memberUsernames) {
        const user = await User.findOne({ username });
        if (user && !members.some(function(m) { return m.toString() === user._id.toString(); })) {
          members.push(user._id);
        }
      }

      const group = new Group({
        name,
        members,
        createdBy: req.user._id
      });
      await group.save();

      for (const memberId of members) {
        const member = await User.findById(memberId);
        await Activity.log(group._id, 'member_joined', req.user._id, {
          userId: memberId,
          username: member.username
        });
      }

      await group.populate('members', '_id username');

      res.status(201).json({
        id: group._id,
        name: group.name,
        members: group.members.map(function(m) {
          return {
            id: m._id,
            username: m.username
          };
        }),
        createdBy: group.createdBy,
        createdAt: group.createdAt
      });
    } catch (error) {
      res.status(500).json({
        error: 'error creating group',
      });
    }
  });

  router.get('/groups', auth, async function(req, res) {
    try {
      const groups = await Group.find({
        members: req.user._id
      }).populate('members', '_id username');

      res.json({
        groups: groups.map(function(group) {
          return {
            id: group._id,
            name: group.name,
            members: group.members.map(function(m) {
              return {
                id: m._id,
                username: m.username
              };
            }),
            createdAt: group.createdAt
          };
        })
      });
    } catch (error) {
      res.status(500).json({
        error: 'error getting groups',
      });
    }
  });

  router.get('/groups/:groupId', auth, groupMember, async function(req, res) {
    try {
      await req.group.populate('members', '_id username');

      res.json({
        id: req.group._id,
        name: req.group.name,
        members: req.group.members.map(function(m) {
          return {
            id: m._id,
            username: m.username
          };
        }),
        createdBy: req.group.createdBy,
        createdAt: req.group.createdAt
      });
    } catch (error) {
      res.status(500).json({
        error: 'error getting group'
      });
    }
  });

  router.post('/groups/:groupId/members', auth, groupMember, async function(req, res) {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({
          error: 'need username',
        });
      }

      const userToAdd = await User.findOne({ username });
      if (!userToAdd) {
        return res.status(404).json({
          error: 'User dne',
        });
      }

      if (req.group.members.some(function(m) { return m.toString() === userToAdd._id.toString(); })) {
        return res.status(400).json({
          error: 'User already in group',
        });
      }

      req.group.members.push(userToAdd._id);
      await req.group.save();

      await Activity.log(req.group._id, 'member_joined', req.user._id, {
        userId: userToAdd._id,
        username: userToAdd.username
      });

      await req.group.populate('members', '_id username');

      res.json({
        id: req.group._id,
        name: req.group.name,
        members: req.group.members.map(function(m) {
          return {
            id: m._id,
            username: m.username
          };
        }),
        createdBy: req.group.createdBy,
        createdAt: req.group.createdAt
      });
    } catch (error) {
      console.error('bad add member:', error);
      res.status(500).json({
        error: 'error adding member',
      });
    }
  });

  router.delete('/groups/:groupId/members/:userId', auth, groupMember, async function(req, res) {
    try {
      const { userId } = req.params;

      const memberIndex = req.group.members.findIndex(
        function(m) { return m.toString() === userId; }
      );
      if (memberIndex === -1) {
        return res.status(404).json({
          error: 'User not in group',
        });
      }

      if (req.group.members.length === 1) {
        return res.status(403).json({
          error: 'delete the group, dont leave',
        });
      }

      const removedUser = await User.findById(userId);

      req.group.members.splice(memberIndex, 1);
      await req.group.save();

      await Activity.log(req.group._id, 'member_left', req.user._id, {
        userId: userId,
        username: removedUser?.username || 'Unknown'
      });

      res.json({
        message: 'Member removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'error removing member',
      });
    }
  });

  router.delete('/groups/:groupId', auth, groupMember, async function(req, res) {
    try {
      const groupId = req.group._id;

      await Expense.deleteMany({ groupId });
      await Chore.deleteMany({ groupId });
      await Activity.deleteMany({ groupId });
      await Group.findByIdAndDelete(groupId);

      res.json({
        message: 'Group deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'error deleting group',
      });
    }
  });

  return router;
};