const ActivityLog = require('../models/mongo/activityLog.model');

const logActivity = async (userId, eventType, productId = null, metadata = {}) => {
  try {
    await ActivityLog.create({ userId, eventType, productId, metadata });
  } catch (error) {
    console.error('Activity log failed:', error.message);
  }
};

module.exports = { logActivity };