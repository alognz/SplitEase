const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'member_joined',
      'member_left',
      'expense_added',
      'expense_updated',
      'expense_deleted',
      'chore_added',
      'chore_completed',
      'chore_deleted'
    ]
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

activitySchema.statics.log = async function(groupId, type, actorId, metadata = {}) {
  return this.create({ groupId, type, actorId, metadata });
};

module.exports = mongoose.model('Activity', activitySchema);
