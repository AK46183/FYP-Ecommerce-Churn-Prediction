// Integration tests ka in-memory "database".
// Sequelize models ke static functions (findAll, create, update...) ko memory wali tables se badal deta hai,
// taake poora Express app (routes -> middleware -> controller -> service) chale lekin asli Neon database na chhua jaye.
// Sirf utna Sequelize jitna is app ko chahiye: where (=, array, Op.ne/lt/gte/in/or...), include, order, limit.
const { Op } = require('sequelize');
const { sequelize } = require('../../src/config/db.postgres');

const tables = new Map(); // modelName -> { rows: [], nextId }
const saved = new Map(); // modelName -> asli functions
const STATICS = ['findByPk', 'findOne', 'findAll', 'create', 'update', 'count', 'destroy', 'decrement', 'increment', 'bulkCreate'];

const table = (model) => {
  if (!tables.has(model.name)) tables.set(model.name, { rows: [], nextId: 1 });
  return tables.get(model.name);
};

const same = (a, b) => {
  if (a === null || a === undefined || b === null || b === undefined) return (a ?? null) === (b ?? null);
  if (a instanceof Date || b instanceof Date) return new Date(a).getTime() === new Date(b).getTime();
  return String(a) === String(b);
};
const num = (v) => (v instanceof Date ? v.getTime() : typeof v === 'string' && !Number.isNaN(Date.parse(v)) && Number.isNaN(Number(v)) ? Date.parse(v) : Number(v));

const matchValue = (value, cond) => {
  if (Array.isArray(cond)) return cond.some((c) => same(value, c));
  if (cond && typeof cond === 'object' && !(cond instanceof Date)) {
    return Object.getOwnPropertySymbols(cond).every((op) => {
      const c = cond[op];
      if (op === Op.ne) return !same(value, c);
      if (op === Op.eq) return same(value, c);
      if (op === Op.in) return c.some((x) => same(value, x));
      if (op === Op.notIn) return !c.some((x) => same(value, x));
      if (op === Op.lt) return value != null && num(value) < num(c);
      if (op === Op.lte) return value != null && num(value) <= num(c);
      if (op === Op.gt) return value != null && num(value) > num(c);
      if (op === Op.gte) return value != null && num(value) >= num(c);
      if (op === Op.iLike || op === Op.like) {
        const re = new RegExp(`^${String(c).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*')}$`, op === Op.iLike ? 'i' : '');
        return re.test(String(value ?? ''));
      }
      throw new Error(`fakeDb: operator ${String(op)} not supported`);
    });
  }
  return same(value, cond);
};

const matches = (row, where = {}) => {
  if (!where) return true;
  for (const key of Object.keys(where)) if (!matchValue(row[key], where[key])) return false;
  for (const op of Object.getOwnPropertySymbols(where)) {
    if (op === Op.or && !where[op].some((w) => matches(row, w))) return false;
    if (op === Op.and && !where[op].every((w) => matches(row, w))) return false;
  }
  return true;
};

/* ------------------------------ Instances ------------------------------ */

const plain = (inst) => JSON.parse(JSON.stringify(inst));

const makeInstance = (model, row) => {
  const inst = { ...row };
  const hidden = (name, fn) => Object.defineProperty(inst, name, { value: fn, enumerable: false, writable: true });
  const extra = {}; // setDataValue wali cheezein (DB mein nahi jaatin)
  const store = () => table(model).rows.find((r) => r.id === inst.id);
  const fields = () => Object.keys(model.rawAttributes);

  hidden('save', async () => {
    const r = store();
    if (r) for (const f of fields()) if (f in inst) r[f] = inst[f];
    if (r && model.options.timestamps !== false) { r.updatedAt = new Date(); inst.updatedAt = r.updatedAt; }
    return inst;
  });
  hidden('update', async (data) => { Object.assign(inst, data); return inst.save(); });
  hidden('reload', async () => { Object.assign(inst, store()); return inst; });
  hidden('destroy', async () => {
    const t = table(model);
    t.rows = t.rows.filter((r) => r.id !== inst.id);
  });
  hidden('increment', async (field, { by = 1 } = {}) => { const r = store(); r[field] = (Number(r[field]) || 0) + by; return inst; });
  hidden('decrement', async (field, { by = 1 } = {}) => { const r = store(); r[field] = (Number(r[field]) || 0) - by; return inst; });
  hidden('getDataValue', (k) => (k in extra ? extra[k] : inst[k]));
  hidden('setDataValue', (k, v) => { extra[k] = v; });
  hidden('get', (opts) => (opts && opts.plain ? plain(inst) : inst));
  hidden('toJSON', () => { const o = {}; for (const k of Object.keys(inst)) o[k] = inst[k]; return o; });
  return inst;
};

/* ------------------------------ Includes ------------------------------ */

/** parent model -> include model: kaun si field kis se judi hai */
const relation = (parent, child) => {
  const assoc = Object.values(parent.associations || {}).find((a) => a.target === child);
  if (!assoc) throw new Error(`fakeDb: no association ${parent.name} -> ${child.name}`);
  return assoc;
};

/** include lagao; include par where ho aur match na kare to parent bhi nikal jata hai (INNER JOIN) */
const applyIncludes = (model, inst, includes = []) => {
  for (const inc of includes) {
    const child = inc.model;
    const assoc = relation(model, child);
    const as = assoc.as;
    if (assoc.associationType === 'BelongsTo') {
      const row = table(child).rows.find((r) => same(r.id, inst[assoc.foreignKey]));
      const ok = row && matches(row, inc.where);
      if (inc.where && !ok) return false;
      const ci = row ? makeInstance(child, row) : null;
      if (ci && inc.include && !applyIncludes(child, ci, inc.include)) return false;
      inst[as] = ci;
    } else {
      const rows = table(child).rows.filter((r) => same(r[assoc.foreignKey], inst.id) && matches(r, inc.where));
      if (inc.where && inc.required !== false && !rows.length) return false;
      inst[as] = rows.map((r) => makeInstance(child, r)).filter((ci) => !inc.include || applyIncludes(child, ci, inc.include));
    }
  }
  return true;
};

const sortRows = (rows, order) => {
  if (!Array.isArray(order) || !order.length) return rows;
  const [[field, dir = 'ASC']] = order;
  const sign = String(dir).toUpperCase() === 'DESC' ? -1 : 1;
  return [...rows].sort((a, b) => (num(a[field]) > num(b[field]) ? sign : num(a[field]) < num(b[field]) ? -sign : 0));
};

/* ------------------------------ Model statics ------------------------------ */

const defaultsFor = (model) => {
  const out = {};
  for (const [name, attr] of Object.entries(model.rawAttributes)) {
    if (attr.defaultValue === undefined || attr.primaryKey) continue;
    const d = attr.defaultValue;
    out[name] = typeof d === 'function' ? d() : (d && d.constructor && d.constructor.key === 'NOW') ? new Date() : JSON.parse(JSON.stringify(d));
  }
  return out;
};

const install = (model) => {
  saved.set(model.name, Object.fromEntries(STATICS.map((s) => [s, model[s]])));

  const find = (opts = {}) => {
    let rows = table(model).rows.filter((r) => matches(r, opts.where));
    rows = sortRows(rows, opts.order);
    let out = rows.map((r) => makeInstance(model, r)).filter((inst) => applyIncludes(model, inst, opts.include));
    if (opts.limit) out = out.slice(0, opts.limit);
    return out;
  };

  model.findAll = async (opts) => find(opts);
  model.findOne = async (opts) => find(opts)[0] || null;
  model.findByPk = async (id, opts = {}) => find({ ...opts, where: { ...(opts.where || {}), id } })[0] || null;
  model.count = async (opts = {}) => find(opts).length;
  model.create = async (data = {}) => {
    const t = table(model);
    const now = new Date();
    const row = {
      id: t.nextId++,
      ...defaultsFor(model),
      ...(model.options.timestamps !== false && { createdAt: now, updatedAt: now }),
      ...JSON.parse(JSON.stringify(data, (k, v) => v)),
    };
    // Date values JSON se string ban jaate hain: wapas Date
    for (const [k, v] of Object.entries(data)) if (v instanceof Date) row[k] = v;
    t.rows.push(row);
    return makeInstance(model, row);
  };
  model.bulkCreate = async (list = []) => Promise.all(list.map((d) => model.create(d)));
  model.update = async (data, { where } = {}) => {
    const rows = table(model).rows.filter((r) => matches(r, where));
    for (const r of rows) Object.assign(r, data, model.options.timestamps !== false ? { updatedAt: new Date() } : {});
    return [rows.length];
  };
  model.destroy = async ({ where } = {}) => {
    const t = table(model);
    const before = t.rows.length;
    t.rows = t.rows.filter((r) => !matches(r, where));
    return before - t.rows.length;
  };
  const step = (sign) => async (field, { by = 1, where } = {}) => {
    for (const r of table(model).rows.filter((x) => matches(x, where))) r[field] = (Number(r[field]) || 0) + sign * by;
    return [[]];
  };
  model.decrement = step(-1);
  model.increment = step(1);
};

let savedTransaction;

/** Saare Postgres models memory par. Test ke aakhir mein restore() zaroor chalayein. */
const installFakeDb = () => {
  tables.clear();
  for (const model of Object.values(sequelize.models)) install(model);
  savedTransaction = sequelize.transaction;
  // transaction: sirf callback chala do (memory mein rollback nahi; tests mein ghalat order fail hone se pehle kuch nahi likhta)
  sequelize.transaction = async (fn) => fn({ LOCK: { UPDATE: 'UPDATE' } });
};

const restore = () => {
  for (const model of Object.values(sequelize.models)) {
    const s = saved.get(model.name);
    if (s) Object.assign(model, s);
  }
  if (savedTransaction) sequelize.transaction = savedTransaction;
  tables.clear();
};

/** Table ki asli rows (test mein seedha dekhne ke liye) */
const rowsOf = (model) => table(model).rows;

module.exports = { installFakeDb, restore, rowsOf };
