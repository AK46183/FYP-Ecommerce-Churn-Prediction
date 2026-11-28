// /api/payments: card payment (Stripe Checkout)
const payment = require('../services/payment.service');
const ApiResponse = require('../utils/ApiResponse');

const handle = (fn) => async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, await fn(req)));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // checkout page: card option dikhana hai ya nahi
  status: handle(() => payment.status()),
  // unpaid card order ke liye Stripe page ka link
  createSession: handle((req) => payment.createSession(req.user.id, req.body?.orderId)),
  // Stripe se wapas aane par: server khud check karta hai
  confirm: handle((req) => payment.confirm(req.user.id, req.body?.sessionId)),
  // Stripe webhook (raw body, signature check)
  webhook: async (req, res) => {
    try {
      await payment.handleWebhook(req.body.toString('utf8'), req.headers['stripe-signature']);
      res.status(200).json({ received: true });
    } catch (error) {
      res.status(error.statusCode || 400).json({ received: false });
    }
  },
};
