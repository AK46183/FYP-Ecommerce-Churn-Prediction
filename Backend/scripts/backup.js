// Poore data ka backup: MongoDB (chats, notifications, logs) + Postgres (users, products, orders ...)
// Chalao:  node scripts/backup.js
// Nateeja:  Backend/backups/<date_time>/mongo/*.json, postgres/*.json, manifest.json
// Phone / address backup mein bhi encrypted rehte hain (DATA_ENCRYPTION_KEY backup mein NAHI jati).
// Sirf aakhri KEEP backups rakhe jate hain. backups/ folder git mein nahi jata.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { QueryTypes } = require('sequelize');
const connectMongo = require('../src/config/db.mongo');
const { sequelize } = require('../src/config/db.postgres');

const KEEP = Number(process.env.BACKUP_KEEP) || 7;
const ROOT = path.join(__dirname, '..', 'backups');
const { EJSON } = mongoose.mongo.BSON;

const stamp = () => new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');

const tableNames = async () => {
  const tables = await sequelize.getQueryInterface().showAllTables();
  return tables.map((t) => (typeof t === 'string' ? t : t.tableName)).filter(Boolean).sort();
};

(async () => {
  const dir = path.join(ROOT, stamp());
  const manifest = { createdAt: new Date().toISOString(), mongo: {}, postgres: {}, note: 'Encrypted fields stay encrypted; restore needs the same DATA_ENCRYPTION_KEY.' };
  try {
    fs.mkdirSync(path.join(dir, 'mongo'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'postgres'), { recursive: true });

    // ---- MongoDB
    await connectMongo();
    if (mongoose.connection.readyState !== 1) throw new Error('MongoDB connect nahi hua (MONGO_URI check karein)');
    const db = mongoose.connection.db;
    manifest.mongoDatabase = db.databaseName;
    const collections = (await db.listCollections().toArray()).map((c) => c.name).filter((n) => !n.startsWith('system.')).sort();
    for (const name of collections) {
      const docs = await db.collection(name).find({}).toArray();
      fs.writeFileSync(path.join(dir, 'mongo', `${name}.json`), EJSON.stringify(docs, { relaxed: false }));
      manifest.mongo[name] = docs.length;
      console.log(`mongo     ${name.padEnd(24)} ${docs.length}`);
    }

    // ---- Postgres
    await sequelize.authenticate();
    for (const table of await tableNames()) {
      const rows = await sequelize.query(`SELECT * FROM "${table}"`, { type: QueryTypes.SELECT });
      fs.writeFileSync(path.join(dir, 'postgres', `${table}.json`), JSON.stringify(rows));
      manifest.postgres[table] = rows.length;
      console.log(`postgres  ${table.padEnd(24)} ${rows.length}`);
    }

    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // purane backups hatao
    const all = fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, 'manifest.json'))).sort();
    for (const old of all.slice(0, Math.max(0, all.length - KEEP))) fs.rmSync(path.join(ROOT, old), { recursive: true, force: true });

    console.log(`\nBackup ban gaya: backups/${path.basename(dir)}  (aakhri ${KEEP} rakhe jate hain)`);
    process.exit(0);
  } catch (err) {
    console.error('Backup FAILED:', err.message);
    fs.rmSync(dir, { recursive: true, force: true }); // adhoora backup na chhoro
    process.exit(1);
  }
})();
