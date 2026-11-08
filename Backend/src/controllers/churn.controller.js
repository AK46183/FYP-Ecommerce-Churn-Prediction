const churnService = require('../services/churn.service');
const { checkHealth } = require('../services/churnClient.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// GET /api/admin/churn?year=2026&month=11   (month 1-12)
const getMonthReport = async (req, res, next) => {
  try {
    const now = new Date();
    const year = Number(req.query.year) || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;
    if (month < 1 || month > 12) throw new ApiError(400, 'month must be 1-12');

    const report = await churnService.getMonthReport(year, month);
    res.status(200).json(new ApiResponse(200, report));
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/churn/run   body: { autoEngage?: boolean }
const runScoring = async (req, res, next) => {
  try {
    const autoEngage = req.body?.autoEngage !== false;
    const result = await churnService.runScoring({ autoEngage });
    res.status(200).json(new ApiResponse(200, result, 'Churn scoring completed'));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/churn/customers?risk=High
const getCustomerScores = async (req, res, next) => {
  try {
    const scores = await churnService.getLatestScores({ risk: req.query.risk });
    res.status(200).json(new ApiResponse(200, scores));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/churn/customers/:userId   (live predict + history)
const getCustomerChurn = async (req, res, next) => {
  try {
    const data = await churnService.scoreCustomer(Number(req.params.userId));
    res.status(200).json(new ApiResponse(200, data));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/churn/alerts
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await churnService.getAlerts();
    res.status(200).json(new ApiResponse(200, alerts));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/churn/engagements?limit=100
const getEngagements = async (req, res, next) => {
  try {
    const data = await churnService.getEngagementResults({ limit: req.query.limit });
    res.status(200).json(new ApiResponse(200, data));
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/churn/engagements/:userId   (manual message)
const engageCustomer = async (req, res, next) => {
  try {
    const msg = await churnService.engageCustomer(Number(req.params.userId));
    res.status(201).json(new ApiResponse(201, msg, 'Engagement message sent'));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/churn/health   (Python service chal rahi hai ya nahi)
const health = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, await checkHealth()));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthReport,
  runScoring,
  getCustomerScores,
  getCustomerChurn,
  getAlerts,
  getEngagements,
  engageCustomer,
  health,
};
