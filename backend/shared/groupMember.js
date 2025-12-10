const Group = require('../models/Group');

const groupMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({
        error: 'Group dne'
      });
    }

    const isMember = group.members.some(
      memberId => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        error: 'You are not a member'
      });
    }

    req.group = group;
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        error: 'Group dne'
      });
    }
    res.status(500).json({
      error: 'booo'
    });
  }
};

module.exports = groupMember;
