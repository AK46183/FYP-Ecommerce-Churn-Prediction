// Store ki buniyadi security (koi extra npm package nahi):
//  1) securityHeaders: browser ko safe rehne ki hidayat (clickjacking, MIME sniffing, referrer leak)
//  2) corsOptions: sirf apni website (CORS_ORIGINS) API call kar sake
//  3) rateLimit: ek IP se had se zyada requests rok do (password guessing, spam, AI ka kharcha)
const ApiError = require('../utils/ApiError');

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // API sirf JSON deti hai: koi script/frame load na ho
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  if (req.secure) res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  next();
};

// .env: CORS_ORIGINS=http://localhost:5173,https://minaysh.vercel.app   (comma se alag)
// Khali ho to development ke liye localhost hi allowed hai.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // origin na ho = same-origin (Vite proxy / tunnel), Postman ya server-to-server: allowed
    if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new ApiError(403, 'This website is not allowed to use the API'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

/**
 * Chhota in-memory rate limiter.
 * rateLimit({ windowMs, max, name, key })  -> middleware
 * key(req) default: IP. Map bharne par sab se purane khaate hatata hai (poora reset nahi, warna attacker limit tod deta).
 */
const rateLimit = ({ windowMs, max, name, message, key = (req) => req.ip }) => {
  const hits = new Map(); // key -> { count, reset }
  const MAX_KEYS = 20000;
  return (req, res, next) => {
    const now = Date.now();
    const k = `${name}:${key(req)}`;
    let entry = hits.get(k);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.delete(k);
      hits.set(k, entry);
      if (hits.size > MAX_KEYS) {
        for (const old of hits.keys()) {
          if (hits.size <= MAX_KEYS * 0.9) break;
          hits.delete(old); // Map mein sab se purane pehle aate hain
        }
      }
    }
    entry.count += 1;
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      return res.status(429).json({ success: false, message: message || 'Too many requests. Please try again later.' });
    }
    return next();
  };
};

// Tayyar limits
const limits = {
  // har IP: poori API par 1 minute mein 300 requests
  api: rateLimit({ name: 'api', windowMs: 60_000, max: 300 }),
  // login/register/Google: 15 minute mein 10 koshishen (password guess karna mushkil)
  auth: rateLimit({ name: 'auth', windowMs: 15 * 60_000, max: 10, message: 'Too many attempts. Please wait 15 minutes and try again.' }),
  // forgot/reset password: 1 ghante mein 5
  reset: rateLimit({ name: 'reset', windowMs: 60 * 60_000, max: 5, message: 'Too many password reset requests. Please try again in an hour.' }),
  // contact form / newsletter: 1 ghante mein 10 (spam)
  forms: rateLimit({ name: 'forms', windowMs: 60 * 60_000, max: 10, message: 'Too many submissions. Please try again later.' }),
  // coupon check: 10 minute mein 20 (codes guess karna)
  coupon: rateLimit({ name: 'coupon', windowMs: 10 * 60_000, max: 20, message: 'Too many coupon attempts. Please wait a few minutes.' }),
};

module.exports = { securityHeaders, corsOptions, rateLimit, limits, allowedOrigins };
