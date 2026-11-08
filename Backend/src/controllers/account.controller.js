const accountService = require('../services/account.service');
const ApiResponse = require('../utils/ApiResponse');

const handle = (fn, status = 200, message) => async (req, res, next) => {
  try {
    const data = await fn(req);
    res.status(status).json(new ApiResponse(status, data, message));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist: handle((req) => accountService.getWishlist(req.user.id)),
  addToWishlist: handle((req) => accountService.addToWishlist(req.user.id, req.body?.sku), 201),
  removeFromWishlist: handle((req) => accountService.removeFromWishlist(req.user.id, req.params.sku)),
  mergeWishlist: handle((req) => accountService.mergeWishlist(req.user.id, req.body?.skus)),

  getAddresses: handle((req) => accountService.getAddresses(req.user.id)),
  addAddress: handle((req) => accountService.addAddress(req.user.id, req.body), 201, 'Address saved'),
  updateAddress: handle((req) => accountService.updateAddress(req.user.id, Number(req.params.id), req.body), 200, 'Address updated'),
  deleteAddress: handle((req) => accountService.deleteAddress(req.user.id, Number(req.params.id)), 200, 'Address deleted'),

  trackActivity: handle((req) => accountService.trackActivity(req.user.id, req.body || {})),
};
