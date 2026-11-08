// Mounted at /api/admin/churn (admin.routes.js ke andar) — sab admin-only
const express = require('express');
const router = express.Router();
const {
  getMonthReport,
  runScoring,
  getCustomerScores,
  getCustomerChurn,
  getAlerts,
  getEngagements,
  engageCustomer,
  health,
} = require('../controllers/churn.controller');

router.get('/', getMonthReport);
router.get('/health', health);
router.post('/run', runScoring);
router.get('/alerts', getAlerts);
router.get('/customers', getCustomerScores);
router.get('/customers/:userId', getCustomerChurn);
router.get('/engagements', getEngagements);
router.post('/engagements/:userId', engageCustomer);

module.exports = router;
