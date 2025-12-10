const { Activity, User } = require('../models');
const auth = require('../shared/auth');
const groupMember = require('../shared/groupMember');

module.exports = function(router) {
  router.get('/groups/:groupId/activities', auth, groupMember, async function(req, res) {
    try {
      const activities = await Activity.find({ groupId: req.group._id })
        .sort({ createdAt: -1 })
        .limit(100);
      const formatted = await Promise.all(
        activities.map(async function(activity) {
          const actor = await User.findById(activity.actorId).select('_id username');
          return {
            id: activity._id,
            type: activity.type,
            actor: {
              id: actor?._id || activity.actorId,
              username: actor?.username || 'Unknown'
            },
            metadata: activity.metadata,
            createdAt: activity.createdAt
          };
        })
      );
      res.json({ activities: formatted });
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({
        error: 'couldnt get the activities',
      });
    }
  });

  return router;
};