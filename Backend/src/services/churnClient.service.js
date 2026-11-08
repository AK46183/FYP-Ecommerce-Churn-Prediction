// Python churn-service (FastAPI) se baat karne wala client.
// Python side: POST {CHURN_API_URL}/predict-churn
//   body:  { tenure_months, order_count, days_since_last_order, complain }
//   reply: { churn_probability, risk_level }
const ApiError = require('../utils/ApiError');

const DAY_MS = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 8000;

const baseUrl = () => (process.env.CHURN_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const daysBetween = (from, to = new Date()) =>
  Math.max(0, Math.floor((new Date(to) - new Date(from)) / DAY_MS));

/**
 * Customer + us ke orders se model ke 4 features banata hai.
 * orders: is customer ke Order rows (cancelled orders count nahi hote)
 */
const buildFeatures = (user, orders = [], now = new Date()) => {
  const valid = orders.filter((o) => o.status !== 'cancelled');
  const lastOrderDate = valid.reduce(
    (latest, o) => (!latest || new Date(o.createdAt) > latest ? new Date(o.createdAt) : latest),
    null
  );

  return {
    tenure_months: +(daysBetween(user.createdAt, now) / 30).toFixed(1),
    order_count: valid.length,
    // Agar kabhi order nahi kiya to signup se ab tak ke din
    days_since_last_order: daysBetween(lastOrderDate || user.createdAt, now),
    complain: user.hasComplaint ? 1 : 0,
  };
};

const predictChurn = async (features) => {
  let res;
  try {
    res = await fetch(`${baseUrl()}/predict-churn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new ApiError(503, `Churn service is not reachable at ${baseUrl()}. Start it with: uvicorn api.app:app --port 8000`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(502, `Churn service error (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return {
    churnProbability: Number(data.churn_probability),
    riskLevel: data.risk_level,
  };
};

// Bohat saare customers: 10-10 ke batch mein call (Python pe load kam)
const predictMany = async (featuresList, batchSize = 10) => {
  const results = [];
  for (let i = 0; i < featuresList.length; i += batchSize) {
    const batch = featuresList.slice(i, i + batchSize);
    results.push(...(await Promise.all(batch.map(predictChurn))));
  }
  return results;
};

const checkHealth = async () => {
  try {
    const res = await fetch(`${baseUrl()}/`, { signal: AbortSignal.timeout(3000) });
    return { online: res.ok, url: baseUrl(), response: res.ok ? await res.json() : null };
  } catch {
    return { online: false, url: baseUrl(), response: null };
  }
};

module.exports = { buildFeatures, predictChurn, predictMany, checkHealth, daysBetween };
