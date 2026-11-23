// MINAYSH Help Bot ka dimagh (rule-based):
//   1) detectIntent(): message ko saaf karke har intent ke keywords se score karta hai,
//      sab se zyada score wala intent jeet jata hai. Koi match na ho to "fallback".
//   2) reply(): intent ke hisaab se jawab. FAQ ka jawab intents.js se seedha,
//      order status database se, complaint ek chhote multi-step flow se.
//
// Bot ka "state" (maslan complaint ka kaunsa step chal raha hai) client har message ke saath
// wapas bhejta hai, is liye server par koi session store nahi. Server state ko dobara check karta hai.
const { INTENTS, FALLBACK, MAIN_MENU } = require('../chatbot/intents');

const MAX_MESSAGE = 500;
const MIN_SCORE = 2; // is se kam score = bot ko samajh nahi aaya
const INTENT_NAMES = new Set([...INTENTS.map((i) => i.name), FALLBACK.name]);

// Barabar score ho to kaun jeete (zyada number = pehle). Complaint sab se zaroori hai:
// "mera order kharab aya" order status nahi, complaint hai.
const PRIORITY = { complaint: 3, faq_cancel: 2, order_status: 1 };

/* ------------------------------------------------------------------ */
/* 1) Text saaf karna + intent pehchanna                               */
/* ------------------------------------------------------------------ */

/**
 * lowercase, punctuation hatao, aur dohraye huay huroof ek kar do
 * ("salaaam" -> "salam", "hiii" -> "hi"). Keywords par bhi yahi chalta hai,
 * is liye "assalam" aur "asalam" dono match ho jate hain.
 */
const normalize = (text = '') =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/([a-z])\1+/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

// Keywords ek dafa normalize karke rakh lo
const COMPILED = INTENTS.map((intent) => ({
  intent,
  keywords: intent.keywords.map(([word, weight]) => [normalize(word), weight]),
}));

// Poora lafz / jumla match ho (warna "hi" bhi "this" mein mil jata)
const hasPhrase = (text, phrase) => ` ${text} `.includes(` ${phrase} `);

/** "MN-12", "mn 12", "order #12", "order 12" -> 12 */
const extractOrderId = (text = '') => {
  const m = String(text).match(/\bmn\s*-?\s*(\d{1,9})\b/i) || String(text).match(/\border\s*(?:no\.?|number|#)?\s*#?\s*(\d{1,9})\b/i);
  return m ? Number(m[1]) : null;
};

/**
 * Har intent ka score = us ke match hone wale keywords ke weights ka jor.
 * Returns { name, score, scores } (scores sirf testing / debugging ke liye)
 */
const detectIntent = (message) => {
  const text = normalize(message);
  const scores = {};
  for (const { intent, keywords } of COMPILED) {
    const score = keywords.reduce((sum, [word, weight]) => (hasPhrase(text, word) ? sum + weight : sum), 0);
    if (score > 0) scores[intent.name] = score;
  }
  // Order number likha ho to order status ki taraf jhukao
  if (extractOrderId(message)) scores.order_status = (scores.order_status || 0) + 3;

  let best = null;
  for (const [name, score] of Object.entries(scores)) {
    if (
      !best ||
      score > best.score ||
      (score === best.score && (PRIORITY[name] || 0) > (PRIORITY[best.name] || 0))
    ) {
      best = { name, score };
    }
  }
  // Complaint ki pakki nishani (kharab, damaged, nahi mila...) ho to "order" lafz ki wajah se
  // order status na chune: "mera order kharab aya" complaint hai.
  if (best && best.name === 'order_status' && (scores.complaint || 0) >= 3) {
    best = { name: 'complaint', score: scores.complaint };
  }
  if (!best || best.score < MIN_SCORE) return { name: FALLBACK.name, score: best?.score || 0, scores };
  return { ...best, scores };
};

/* ------------------------------------------------------------------ */
/* 2) Jawab banana                                                     */
/* ------------------------------------------------------------------ */

const fromIntent = (intent) => ({
  intent: intent.name,
  reply: intent.reply,
  quickReplies: intent.quickReplies || [],
  links: intent.links || [],
});

const STATUS_TEXT = {
  Pending: 'We have received it and will start packing soon.',
  Processing: 'It is being packed right now.',
  Confirmed: 'It is confirmed and will be packed soon.',
  Shipped: 'It is on the way to you with our courier.',
  Delivered: 'It has been delivered. We hope you love it!',
  Completed: 'It has been delivered. We hope you love it!',
  Cancelled: 'This order was cancelled.',
};

// Chat mein sirf zaroori cheezein (address / phone nahi)
const orderCard = (o) => ({
  id: o.id,
  status: o.status,
  date: o.date,
  total: o.total,
  items: (o.items || []).reduce((n, i) => n + (i.quantity || 0), 0),
  firstItem: o.items?.[0]?.name || null,
});

const SIGN_IN = {
  reply: 'Please sign in so I can find your orders safely. After signing in, open this chat again and ask "where is my order".',
  links: [{ label: 'Sign in', to: '/login' }],
};

// Sirf poora message yahi ho to flow band ho ("order nahi mila" complaint hai, cancel nahi)
const CANCEL_WORDS = new Set(['cancel', 'stop', 'never mind', 'nevermind', 'rehne do', 'chodo', 'chhodo', 'no', 'nahi'].map(normalize));
const isCancel = (message) => CANCEL_WORDS.has(normalize(message));
const NOT_ORDER = 'not about an order';

// In jawabon ke saath at-risk customer ka offer dikhta hai
const OFFER_INTENTS = new Set(['greeting', 'fallback']);
const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/**
 * Bot banata hai. deps = database wale kaam (tests mein nakli functions de sakte hain).
 *   getUserOrders(userId) -> orders (frontend shape: id 'MN-12', status, date, total, items)
 *   getUserOrderById(userId, id) -> order, na mile to error (statusCode 404)
 *   getUser(userId) -> { id, name, email } | null
 *   saveComplaint({ name, email, message, orderRef, userId }) -> { id }
 *   notifyAdmin({ type, title, body, link, meta })
 *   allowComplaint(ip) -> true | false   (spam se bachao)
 *   getOffer(userId) -> { code, description, expiresAt } | null   (optional: at-risk customer ka personal coupon)
 */
const createHelpbot = (deps) => {
  /* ----------------------------- Order status ----------------------------- */
  const orderStatus = async ({ message, userId }) => {
    if (!userId) return { intent: 'order_status', ...SIGN_IN, quickReplies: [{ label: 'Delivery & charges', intent: 'faq_delivery' }] };

    const id = extractOrderId(message);
    if (id) {
      let order;
      try {
        order = await deps.getUserOrderById(userId, id);
      } catch (error) {
        if (error.statusCode !== 404) throw error;
        return {
          intent: 'order_status',
          reply: `I couldn't find order MN-${id} in your account. Please check the number, or tap below to see all your orders.`,
          quickReplies: [{ label: 'Show my orders', intent: 'order_status' }],
          links: [],
        };
      }
      return {
        intent: 'order_status',
        reply: `Order ${order.id} is ${order.status}. ${STATUS_TEXT[order.status] || ''}`.trim(),
        orders: [orderCard(order)],
        quickReplies: [{ label: 'Make a complaint', intent: 'complaint' }, { label: 'Delivery & charges', intent: 'faq_delivery' }],
        links: [],
      };
    }

    const orders = await deps.getUserOrders(userId);
    if (!orders.length) {
      return {
        intent: 'order_status',
        reply: "You haven't placed any orders yet. When you do, you can track them right here.",
        links: [{ label: 'Start shopping', to: '/' }],
        quickReplies: [],
      };
    }
    const latest = orders[0];
    return {
      intent: 'order_status',
      reply: `Your latest order ${latest.id} is ${latest.status}. ${STATUS_TEXT[latest.status] || ''}`.trim()
        + (orders.length > 1 ? `\nHere are your recent orders. You can also type an order number, e.g. ${orders[1].id}.` : ''),
      orders: orders.slice(0, 3).map(orderCard),
      quickReplies: [{ label: 'Make a complaint', intent: 'complaint' }],
      links: [{ label: 'All my orders', to: '/account/orders' }],
    };
  };

  /* ------------------------------ Complaint ------------------------------- */
  // Steps: order -> details -> (guest ho to) email -> save
  const askDetails = (state) => ({
    intent: 'complaint',
    reply: 'Please tell me what went wrong in a few words (for example: "lipstick arrived broken" or "wrong shade").',
    quickReplies: [{ label: 'Cancel', message: 'cancel' }],
    state: { ...state, step: 'details' },
  });

  const startComplaint = async ({ message, userId }) => {
    const base = { flow: 'complaint', firstMessage: String(message || '').slice(0, MAX_MESSAGE) };
    const id = extractOrderId(message);

    if (id) return askDetails({ ...base, orderRef: `MN-${id}` });

    if (userId) {
      const orders = await deps.getUserOrders(userId);
      if (orders.length) {
        return {
          intent: 'complaint',
          reply: "I'm sorry to hear that. Which order is this about?",
          quickReplies: [
            ...orders.slice(0, 3).map((o) => ({ label: `${o.id} (${o.status})`, message: o.id })),
            { label: 'Not about an order', message: NOT_ORDER },
            { label: 'Cancel', message: 'cancel' },
          ],
          state: { ...base, step: 'order' },
        };
      }
    }
    return {
      intent: 'complaint',
      reply: "I'm sorry to hear that. If it is about an order, please type the order number (for example MN-12). Otherwise tap \"Not about an order\".",
      quickReplies: [{ label: 'Not about an order', message: NOT_ORDER }, { label: 'Cancel', message: 'cancel' }],
      state: { ...base, step: 'order' },
    };
  };

  const finishComplaint = async ({ state, userId, ip, email }) => {
    const user = userId ? await deps.getUser(userId) : null;
    const contactEmail = user?.email || email;
    if (!deps.allowComplaint(ip)) {
      return {
        intent: 'complaint',
        reply: 'You have sent several complaints in a short time. Please wait a little, or reach us on WhatsApp (0332 8649439).',
        links: [{ label: 'Open WhatsApp', href: 'https://wa.me/923328649439' }],
        state: null,
      };
    }

    const text = [state.firstMessage, state.details].filter(Boolean).join('\n');
    const saved = await deps.saveComplaint({
      name: user?.name || contactEmail.split('@')[0],
      email: contactEmail,
      message: text,
      orderRef: state.orderRef || null,
      userId: user?.id || null,
    });
    const ticket = `C-${String(saved.id).slice(-6).toUpperCase()}`;

    deps.notifyAdmin({
      type: 'complaint',
      title: `Complaint (Help Bot) from ${user?.name || contactEmail}`,
      body: `${user?.name || 'Guest'} <${contactEmail}>${state.orderRef ? ` · Order ${state.orderRef}` : ''} · Ticket ${ticket}\n\n${text}`,
      link: '/admin/messages',
      meta: { messageId: saved.id, userId: user?.id || null, source: 'helpbot' },
    });

    return {
      intent: 'complaint',
      reply: `Thank you. Your complaint has been registered (ticket ${ticket})${state.orderRef ? ` for order ${state.orderRef}` : ''}. Our team will contact you at ${contactEmail} within 1–2 business days.`,
      ticket,
      quickReplies: [{ label: 'Track my order', intent: 'order_status' }, { label: 'Talk to a person', intent: 'human_support' }],
      state: null,
    };
  };

  /** Complaint flow ka agla step (state client se aaya hai, is liye har cheez dobara check) */
  const continueComplaint = async ({ message, state, userId, ip }) => {
    if (isCancel(message)) {
      return { intent: 'complaint', reply: 'No problem, I have cancelled the complaint. Anything else I can help with?', quickReplies: MAIN_MENU, state: null };
    }

    const clean = {
      flow: 'complaint',
      firstMessage: String(state.firstMessage || '').slice(0, MAX_MESSAGE),
      orderRef: /^MN-\d{1,9}$/.test(state.orderRef || '') ? state.orderRef : null,
      details: String(state.details || '').slice(0, MAX_MESSAGE),
    };

    if (state.step === 'order') {
      if (normalize(message) === normalize(NOT_ORDER)) return askDetails(clean);
      const id = extractOrderId(message) || (/^\s*\d{1,9}\s*$/.test(message) ? Number(message) : null);
      if (!id) {
        return {
          intent: 'complaint',
          reply: 'Please type the order number, for example MN-12, or tap "Not about an order".',
          quickReplies: [{ label: 'Not about an order', message: NOT_ORDER }, { label: 'Cancel', message: 'cancel' }],
          state: { ...clean, step: 'order' },
        };
      }
      if (userId) {
        // Login ho to order isi customer ka hona chahiye
        try {
          await deps.getUserOrderById(userId, id);
        } catch (error) {
          if (error.statusCode !== 404) throw error;
          return {
            intent: 'complaint',
            reply: `I couldn't find order MN-${id} in your account. Please check the number, or tap "Not about an order".`,
            quickReplies: [{ label: 'Not about an order', message: NOT_ORDER }, { label: 'Cancel', message: 'cancel' }],
            state: { ...clean, step: 'order' },
          };
        }
      }
      return askDetails({ ...clean, orderRef: `MN-${id}` });
    }

    if (state.step === 'details') {
      const details = String(message || '').trim().slice(0, MAX_MESSAGE);
      if (details.length < 5) {
        return { ...askDetails(clean), reply: 'Please write a little more about the problem so our team can help.' };
      }
      const next = { ...clean, details };
      if (!userId) {
        return {
          intent: 'complaint',
          reply: 'Thanks. What email address can our team reach you at?',
          quickReplies: [{ label: 'Cancel', message: 'cancel' }],
          state: { ...next, step: 'email' },
        };
      }
      return finishComplaint({ state: next, userId, ip });
    }

    if (state.step === 'email') {
      const email = String(message || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) {
        return {
          intent: 'complaint',
          reply: 'That does not look like an email address. Please type it like name@example.com.',
          quickReplies: [{ label: 'Cancel', message: 'cancel' }],
          state: { ...clean, step: 'email' },
        };
      }
      return finishComplaint({ state: clean, userId: null, ip, email });
    }

    // Anjaan step: flow shuru se
    return startComplaint({ message: clean.firstMessage, userId });
  };

  /* -------------------------------- Main --------------------------------- */
  /**
   * input: { message?, intent?, state?, userId?, ip? }
   *   intent: button dabaya ho to seedha intent (keyword matching ki zaroorat nahi)
   */
  const reply = async ({ message = '', intent: forced, state, userId = null, ip = '' }) => {
    const text = String(message || '').trim().slice(0, MAX_MESSAGE);

    // Complaint flow chal raha ho to message usi flow ko jata hai
    if (state && state.flow === 'complaint' && ['order', 'details', 'email'].includes(state.step) && !forced) {
      return continueComplaint({ message: text, state, userId, ip });
    }

    const name = forced && INTENT_NAMES.has(forced) ? forced : detectIntent(text).name;
    if (name === 'order_status') return orderStatus({ message: text, userId });
    if (name === 'complaint') return startComplaint({ message: forced ? '' : text, userId });

    const intent = INTENTS.find((i) => i.name === name) || FALLBACK;
    const out = fromIntent(intent);

    // Chatbot-based engagement: at-risk customer ko greeting / menu par us ka personal offer
    if (userId && OFFER_INTENTS.has(name) && deps.getOffer) {
      const offer = await deps.getOffer(userId);
      if (offer) {
        out.offer = { ...offer, validUntil: offer.expiresAt ? formatDate(offer.expiresAt) : null };
        out.reply += '\n\n✦ We have a special offer waiting for you:';
      }
    }
    return out;
  };

  return { reply };
};

module.exports = { createHelpbot, detectIntent, normalize, extractOrderId, MAX_MESSAGE, INTENT_NAMES };
