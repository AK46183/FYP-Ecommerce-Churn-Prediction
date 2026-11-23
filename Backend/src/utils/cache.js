// Chhota sa in-memory cache (TTL ke saath). Products ki list baar baar database se na lani pare.
// Ek server instance ke liye kaafi hai; kai servers hon to Redis chahiye (SECURITY.md / report: known limit).
const store = new Map();
const stats = { hits: 0, misses: 0 };

const get = (key) => {
  const entry = store.get(key);
  if (entry && entry.expires > Date.now()) {
    stats.hits += 1;
    return entry.value;
  }
  if (entry) store.delete(key);
  stats.misses += 1;
  return undefined;
};

const set = (key, value, ttlMs) => {
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
};

/** prefix se shuru hone wali sab keys hata do (jaise 'products:') */
const clear = (prefix = '') => {
  for (const key of store.keys()) if (key.startsWith(prefix)) store.delete(key);
};

/** Cache mein ho to wahi, warna loader chala kar save karo */
const wrap = async (key, ttlMs, loader) => {
  const hit = get(key);
  if (hit !== undefined) return hit;
  return set(key, await loader(), ttlMs);
};

module.exports = { get, set, clear, wrap, stats };
