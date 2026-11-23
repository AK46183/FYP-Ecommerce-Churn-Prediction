// Har test file sab se pehle yeh file require karti hai.
// Tests asli database ko kabhi nahi chhote: Postgres / MongoDB ke functions test ke andar stub hote hain.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-that-is-definitely-longer-than-32-characters';
process.env.DATA_ENCRYPTION_KEY = 'a'.repeat(64);
// Ghalat port wala dummy URI: koi query galti se chali bhi to asli database tak nahi pohnchegi
process.env.POSTGRES_URI = 'postgres://test:test@127.0.0.1:1/test_db';

// MongoDB connected nahi: activity log foran fail ho (10 second intezar na kare). logActivity khud galti pakar leta hai.
const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

// Test output saaf rahe (activity log / email ki warnings chhupao)
console.error = () => {};
console.warn = () => {};
