// Field-level encryption (AES-256-GCM) for personal data in Postgres:
// phone numbers and delivery addresses are stored encrypted, so a leaked database dump
// or backup does not reveal them. Key: DATA_ENCRYPTION_KEY in .env (64 hex characters = 32 bytes).
//
// Stored format:  enc:v1:<base64(iv 12 bytes | auth tag 16 bytes | ciphertext)>
// Old plain values keep working (they are returned as-is) until scripts/encrypt-existing-data.js runs.
const crypto = require('crypto');
const { DataTypes } = require('sequelize');

const PREFIX = 'enc:v1:';
let cachedKey;
let warnedDecrypt = false;

const getKey = () => {
  if (cachedKey) return cachedKey;
  const hex = (process.env.DATA_ENCRYPTION_KEY || '').trim();
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error('DATA_ENCRYPTION_KEY .env mein 64 hex characters ka hona chahiye. Bana lein: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  }
  cachedKey = Buffer.from(hex, 'hex');
  return cachedKey;
};

const isEncrypted = (v) => typeof v === 'string' && v.startsWith(PREFIX);

const encrypt = (value) => {
  if (value === null || value === undefined || value === '') return value;
  const text = String(value);
  if (isEncrypted(text)) return text;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const ct = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return PREFIX + Buffer.concat([iv, cipher.getAuthTag(), ct]).toString('base64');
};

const decrypt = (value) => {
  if (!isEncrypted(value)) return value; // purana plain data ya null
  try {
    const raw = Buffer.from(value.slice(PREFIX.length), 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
  } catch {
    if (!warnedDecrypt) {
      console.error('[crypto] decrypt failed: DATA_ENCRYPTION_KEY badal gayi hai ya data kharab hai');
      warnedDecrypt = true;
    }
    return '';
  }
};

/** Sequelize column: TEXT, set par encrypt, get par decrypt */
const encryptedText = (name, extra = {}) => ({
  type: DataTypes.TEXT,
  ...extra,
  encrypted: true,
  set(v) { this.setDataValue(name, encrypt(v)); },
  get() { return decrypt(this.getDataValue(name)); },
});

/**
 * Sequelize JSONB column for an address object. The whole object is encrypted;
 * only `city` stays readable (reports and delivery stats use it).
 */
const encryptedAddress = (name, extra = {}) => ({
  type: DataTypes.JSONB,
  ...extra,
  set(v) {
    if (!v || typeof v !== 'object' || v.enc) return this.setDataValue(name, v);
    this.setDataValue(name, { enc: encrypt(JSON.stringify(v)), city: v.city || '' });
  },
  get() {
    const v = this.getDataValue(name);
    if (!v || typeof v !== 'object' || !v.enc) return v;
    try { return JSON.parse(decrypt(v.enc) || '{}'); } catch { return { city: v.city || '' }; }
  },
});

module.exports = { encrypt, decrypt, isEncrypted, encryptedText, encryptedAddress, getKey };
