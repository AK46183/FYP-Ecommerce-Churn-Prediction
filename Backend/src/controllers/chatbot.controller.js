// MINAYSH Skin Assistant: website <-> Python skincare-ai service (server.py) ka pul.
// .env:  SKINCARE_AI_URL=http://127.0.0.1:8001   SKINCARE_SERVICE_KEY=(wohi jo skincare-ai/.env mein hai, optional)
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const ChatSession = require('../models/mongo/chatSession.model');
const ChatMessage = require('../models/mongo/chatMessage.model');

const AI_URL = (process.env.SKINCARE_AI_URL || 'http://127.0.0.1:8001').replace(/\/$/, '');
const SERVICE_KEY = process.env.SKINCARE_SERVICE_KEY || null;
const MAX_MESSAGE = 1000;
const MAX_IMAGE_B64 = 5.5 * 1024 * 1024; // ~4 MB tasveer
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

// chhota in-memory rate limit: har session/IP ke liye 1 minute mein 20 messages
const hits = new Map();
const limited = (key) => {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 20;
};

const callAI = async (path, body, timeoutMs = 90_000) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${AI_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(SERVICE_KEY && { 'X-Service-Key': SERVICE_KEY }) },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(res.status === 400 ? 400 : 502, json?.error || 'Skin assistant ne jawab nahi diya');
    return json;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(503, 'Skin assistant abhi available nahi hai. Thori der baad try karein.');
  } finally {
    clearTimeout(timer);
  }
};

// Chat ko MongoDB mein save karta hai. Chat ko kabhi rokta nahi: Mongo band ho to bas save nahi hota.
const SCAN_FIELDS = ['oiliness', 'acne', 'dryness', 'redness', 'dark_spots', 'dark_circles', 'skin_type_guess', 'needs_dermatologist'];
const saveTurn = async ({ sessionId, userId, message, hadImage, scan, reply, profile, products }) => {
  if (mongoose.connection.readyState !== 1) return; // MongoDB connected nahi
  const scanSummary = scan && scan.ok && scan.face_found
    ? Object.fromEntries(SCAN_FIELDS.filter((k) => k in scan).map((k) => [k, scan[k]]))
    : null;
  await ChatMessage.insertMany([
    { sessionId, userId, role: 'user', text: message, hadImage, scan: scanSummary },
    { sessionId, userId, role: 'bot', text: reply, productSkus: (products || []).map((p) => p.sku) },
  ]);
  await ChatSession.updateOne(
    { sessionId },
    {
      $setOnInsert: { sessionId },
      $set: {
        userId,
        lastMessageAt: new Date(),
        skinType: profile?.skin_type || null,
        concerns: Array.isArray(profile?.concerns) ? profile.concerns : [],
        ...(hadImage && { usedScan: true }),
      },
      $inc: { messageCount: 2 },
    },
    { upsert: true },
  );
};

// session id: client ka random id + (login ho to) user id, taake kisi aur ki chat na khule
const sessionKey = (req) => {
  const sid = String(req.body?.sessionId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60);
  if (sid.length < 8) throw new ApiError(400, 'sessionId chahiye');
  return `${req.user?.id ? `u${req.user.id}` : 'guest'}-${sid}`;
};

// POST /api/chatbot/message   body: { sessionId, message?, imageBase64?, imageMime? }
const sendMessage = async (req, res, next) => {
  try {
    const session_id = sessionKey(req);
    const message = String(req.body?.message || '').trim().slice(0, MAX_MESSAGE);
    const image = req.body?.imageBase64 ? String(req.body.imageBase64) : null;
    const mime = String(req.body?.imageMime || 'image/jpeg');

    if (!message && !image) throw new ApiError(400, 'Message ya tasveer chahiye');
    if (image && (image.length > MAX_IMAGE_B64 || !ALLOWED_MIME.includes(mime))) {
      throw new ApiError(400, 'Tasveer JPG/PNG/WEBP ho aur 4 MB se chhoti ho');
    }
    if (limited(session_id) || limited(`ip-${req.ip}`)) throw new ApiError(429, 'Bohat zyada messages. Ek minute baad try karein.');

    const out = await callAI('/chat', { session_id, message, ...(image && { image_base64: image, image_mime: mime }) });
    // scan ka poora JSON client ko nahi bhejte, sirf itna ke scan hua ya nahi
    const scanned = out.scan ? { ok: !!out.scan.ok, faceFound: !!out.scan.face_found } : null;
    // bot ne jin store products ka naam liya (chat mein product cards ke liye)
    const products = (Array.isArray(out.products) ? out.products : []).slice(0, 6).map((p) => ({
      sku: String(p.sku), name: String(p.name), brand: p.brand || '', price: Number(p.price) || 0,
    }));
    saveTurn({
      sessionId: session_id, userId: req.user?.id || null, message, hadImage: !!image,
      scan: out.scan, reply: out.reply, profile: out.profile, products,
    }).catch((e) => console.error('Chat save nahi hui:', e.message));
    // lambi dash (—) website par nahi dikhani
    const reply = String(out.reply || '').replace(/\s*[—–]\s*/g, ', ');
    res.status(200).json(new ApiResponse(200, { reply, scanned, products }));
  } catch (error) {
    next(error);
  }
};

// POST /api/chatbot/reset   body: { sessionId }
const resetChat = async (req, res, next) => {
  try {
    await callAI('/reset', { session_id: sessionKey(req) }, 10_000);
    res.status(200).json(new ApiResponse(200, { ok: true }));
  } catch (error) {
    next(error);
  }
};

// ---------- Admin: save hui chats ----------
const needMongo = () => {
  if (mongoose.connection.readyState !== 1) throw new ApiError(503, 'MongoDB connected nahi hai');
};

// GET /api/chatbot/admin/sessions?page=1&limit=20&q=
const listSessions = async (req, res, next) => {
  try {
    needMongo();
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const q = String(req.query.q || '').trim().slice(0, 60);
    const filter = {};
    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const ids = await ChatMessage.distinct('sessionId', { text: { $regex: safe, $options: 'i' } });
      filter.sessionId = { $in: ids.slice(0, 500) };
    }
    const [total, sessions, messages, scans, concernRows] = await Promise.all([
      ChatSession.countDocuments(filter),
      ChatSession.find(filter).sort({ lastMessageAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ChatMessage.countDocuments({}),
      ChatSession.countDocuments({ usedScan: true }),
      ChatSession.aggregate([{ $unwind: '$concerns' }, { $group: { _id: '$concerns', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
    ]);
    // har chat ka pehla user message (list mein jhalak ke liye)
    const firsts = await ChatMessage.aggregate([
      { $match: { sessionId: { $in: sessions.map((s) => s.sessionId) }, role: 'user', text: { $ne: '' } } },
      { $sort: { createdAt: 1 } },
      { $group: { _id: '$sessionId', text: { $first: '$text' } } },
    ]);
    const preview = Object.fromEntries(firsts.map((f) => [f._id, f.text]));
    res.status(200).json(new ApiResponse(200, {
      total, page, limit,
      stats: { chats: await ChatSession.countDocuments({}), messages, scans, topConcerns: concernRows.map((c) => ({ concern: c._id, count: c.count })) },
      sessions: sessions.map((s) => ({
        sessionId: s.sessionId, userId: s.userId, messageCount: s.messageCount, usedScan: s.usedScan,
        skinType: s.skinType, concerns: s.concerns, startedAt: s.createdAt, lastMessageAt: s.lastMessageAt,
        preview: (preview[s.sessionId] || '').slice(0, 120),
      })),
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/chatbot/admin/sessions/:sessionId
const getSession = async (req, res, next) => {
  try {
    needMongo();
    const sessionId = String(req.params.sessionId || '').slice(0, 80);
    const session = await ChatSession.findOne({ sessionId }).lean();
    if (!session) throw new ApiError(404, 'Chat nahi mili');
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).limit(500).lean();
    res.status(200).json(new ApiResponse(200, {
      session: {
        sessionId: session.sessionId, userId: session.userId, messageCount: session.messageCount, usedScan: session.usedScan,
        skinType: session.skinType, concerns: session.concerns, startedAt: session.createdAt, lastMessageAt: session.lastMessageAt,
      },
      messages: messages.map((m) => ({
        role: m.role, text: m.text, hadImage: m.hadImage, scan: m.scan, productSkus: m.productSkus || [], at: m.createdAt,
      })),
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/chatbot/admin/status  -> Settings page: AI service chal rahi hai ya nahi
const serviceStatus = async (req, res, next) => {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    let ai = { running: false, llm: false };
    try {
      const r = await fetch(`${AI_URL}/health`, { signal: ctrl.signal });
      const j = await r.json();
      ai = { running: !!j.ok, llm: !!j.llm };
    } catch {
      /* service band */
    } finally {
      clearTimeout(timer);
    }
    res.status(200).json(new ApiResponse(200, { ai, chatStorage: mongoose.connection.readyState === 1 }));
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, resetChat, listSessions, getSession, serviceStatus };
