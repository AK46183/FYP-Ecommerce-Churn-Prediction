// Backup ko wapas daalna.
//
// 1) TEST (default, asli data ko haath nahi lagta):
//      node scripts/restore.js
//    Aakhri backup ko ALAG jagah restore karta hai (MongoDB: "<db>_restore_test" database,
//    Postgres: "restore_test" schema), har table / collection ki ginti backup se milata hai, phir test copy mita deta hai.
//
// 2) Mita hua MongoDB data wapas (chats waghera):
//      node scripts/restore.js --missing-mongo
//    Sirf woh documents daalta hai jo ab database mein NAHI hain. Jo maujood hain un ko nahi badalta.
//
// Postgres (users, orders, products) ka asli restore: Neon dashboard -> Branches -> Restore (point in time).
// Kisi khaas backup ke liye: node scripts/restore.js backups/2026-11-20_16-30
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');
const connectMongo = require('../src/config/db.mongo');
const { sequelize } = require('../src/config/db.postgres');

const ROOT = path.join(__dirname, '..', 'backups');
const { EJSON } = mongoose.mongo.BSON;
const args = process.argv.slice(2);
const MODE_MISSING = args.includes('--missing-mongo');

const pickBackup = () => {
  const given = args.find((a) => !a.startsWith('--'));
  if (given) return path.resolve(given);
  const all = fs.existsSync(ROOT) ? fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, 'manifest.json'))).sort() : [];
  if (!all.length) throw new Error('Koi backup nahi mila. Pehle chalayein: node scripts/backup.js');
  return path.join(ROOT, all[all.length - 1]);
};

const readMongo = (dir, name) => EJSON.parse(fs.readFileSync(path.join(dir, 'mongo', `${name}.json`), 'utf8'), { relaxed: false });

const confirm = (q) => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(q, (a) => { rl.close(); resolve(a.trim()); });
});

const testRestore = async (dir, manifest) => {
  let ok = true;
  const check = (label, expected, got) => {
    const pass = expected === got;
    ok = ok && pass;
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${label.padEnd(34)} backup ${expected}  restored ${got}`);
  };

  // ---- MongoDB -> alag test database
  const testDb = mongoose.connection.useDb(`${mongoose.connection.db.databaseName}_restore_test`, { useCache: false });
  await testDb.dropDatabase();
  for (const [name, count] of Object.entries(manifest.mongo)) {
    const docs = readMongo(dir, name);
    if (docs.length) await testDb.collection(name).insertMany(docs, { ordered: false });
    check(`mongo ${name}`, count, await testDb.collection(name).countDocuments());
  }
  await testDb.dropDatabase();

  // ---- Postgres -> alag "restore_test" schema
  await sequelize.query('DROP SCHEMA IF EXISTS restore_test CASCADE');
  await sequelize.query('CREATE SCHEMA restore_test');
  try {
    for (const [table, count] of Object.entries(manifest.postgres)) {
      const rows = JSON.parse(fs.readFileSync(path.join(dir, 'postgres', `${table}.json`), 'utf8'));
      await sequelize.query(`CREATE TABLE restore_test."${table}" (LIKE public."${table}" INCLUDING DEFAULTS)`);
      if (rows.length) {
        await sequelize.query(
          `INSERT INTO restore_test."${table}" SELECT * FROM json_populate_recordset(CAST(NULL AS restore_test."${table}"), CAST(:rows AS json))`,
          { replacements: { rows: JSON.stringify(rows) } },
        );
      }
      const [[{ n }]] = await sequelize.query(`SELECT COUNT(*)::int AS n FROM restore_test."${table}"`);
      check(`postgres ${table}`, count, n);
    }
  } finally {
    await sequelize.query('DROP SCHEMA IF EXISTS restore_test CASCADE');
  }
  return ok;
};

const restoreMissingMongo = async (dir, manifest) => {
  const answer = await confirm(`Asli MongoDB (${mongoose.connection.db.databaseName}) mein sirf MITE HUE documents wapas daale jayenge. Likhein RESTORE: `);
  if (answer !== 'RESTORE') {
    console.log('Ruk gaye, kuch nahi badla.');
    return true;
  }
  for (const name of Object.keys(manifest.mongo)) {
    const docs = readMongo(dir, name);
    if (!docs.length) continue;
    const res = await mongoose.connection.db.collection(name).bulkWrite(
      docs.map(({ _id, ...rest }) => ({ updateOne: { filter: { _id }, update: { $setOnInsert: rest }, upsert: true } })),
      { ordered: false },
    );
    console.log(`${name.padEnd(24)} wapas aaye: ${res.upsertedCount}`);
  }
  return true;
};

(async () => {
  try {
    const dir = pickBackup();
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    console.log(`Backup: ${path.basename(dir)}  (${manifest.createdAt})\n`);
    await connectMongo();
    if (mongoose.connection.readyState !== 1) throw new Error('MongoDB connect nahi hua');
    await sequelize.authenticate();
    const ok = MODE_MISSING ? await restoreMissingMongo(dir, manifest) : await testRestore(dir, manifest);
    if (!MODE_MISSING) console.log(ok ? '\nRestore test PASSED: backup sahi hai aur wapas daala ja sakta hai.' : '\nRestore test FAILED');
    process.exit(ok ? 0 : 1);
  } catch (err) {
    console.error('Restore FAILED:', err.message);
    process.exit(1);
  }
})();
