const { logActivity } = require('../services/activityLogger.service');

const logProductView = async (req, res, next) => {
  console.log('logProductView middleware called, user:', req.user);
  if (req.user) {
    logActivity(req.user.id, 'product_view', req.params.id);
  }
  next();
};

module.exports = { logProductView };