// Dashboard ke numbers MongoDB + Postgres ki kai queries se bante hain (5-10 second).
// Yeh unhein 60 second yaad rakhta hai: pehli dafa ke baad Dashboard, Admin Home aur Reports foran khulte hain.
// Data 60 second se purana ho to wohi foran de kar peeche se naya bana leta hai.
const adminService = require('./admin.service');

const FRESH_MS = 60 * 1000;
const cache = new Map(); // range -> { data, at, pending }

const refresh = (range) => {
  const entry = cache.get(range) || {};
  if (!entry.pending) {
    entry.pending = adminService
      .getDashboard(range)
      .then((data) => {
        cache.set(range, { data, at: Date.now(), pending: null });
        return data;
      })
      .catch((err) => {
        entry.pending = null;
        throw err;
      });
    cache.set(range, entry);
  }
  return entry.pending;
};

const getDashboardCached = async (range = '30d') => {
  const key = ['7d', '30d', '90d'].includes(range) ? range : '30d';
  const entry = cache.get(key);
  if (entry?.data) {
    if (Date.now() - entry.at > FRESH_MS) refresh(key).catch(() => {}); // peeche se taza karo
    return entry.data;
  }
  return refresh(key);
};

// Server start hone ke thori der baad pehle se bana lo, taake admin ko pehli dafa bhi intezar na karna pare
setTimeout(() => {
  refresh('30d').catch(() => {});
}, 10000).unref();

module.exports = { getDashboardCached };
