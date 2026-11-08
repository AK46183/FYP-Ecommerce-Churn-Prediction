const { logActivity } = require('../services/activityLogger.service');

const logProductView = async (req, res, next) => {
  if (req.user) {
    const id = req.params.id;
    if (/^\d+$/.test(id)) logActivity(req.user.id, 'product_view', Number(id));
    else logActivity(req.user.id, 'product_view', null, { sku: id });
  }
  next();
};

module.exports = { logProductView };