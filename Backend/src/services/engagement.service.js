// Rule-based engagement (flowchart: "Send Engagement Message — uses simple rules:
// Reminder, Discount Offer, Support Message").
// Yahan koi AI nahi — sirf simple if/else rules, taake viva mein asaani se samjhaya ja sake.
const EngagementMessage = require('../models/mongo/engagementMessage.model');
const { sendEngagementEmail } = require('./mail.service');
const { createPersonalCoupon } = require('./coupon.service');

// Ek customer ko dobara message bhejne se pehle kitne din ka gap
const COOLDOWN_DAYS = 7;

/**
 * Customer ke features + risk se batata hai:
 *  - reason:  woh kyun risk pe hai (admin ko dikhane ke liye)
 *  - type:    reminder | discount | support | null
 *  - action:  admin ko kya karna chahiye
 *  - channel: SMS / Email / Call ...
 *  - message: customer ko jaane wala text
 * chat: Help Bot + Skincare Assistant ke pichle 30 din ke signals (churn.service chatSignals); na ho to {}
 */
const buildSuggestion = (features, riskLevel, name = 'there', chat = {}) => {
  const { order_count: orders, days_since_last_order: days, complain, tenure_months: tenure } = features;
  const first = String(name).split(' ')[0];
  const picks = (chat.suggested || []).map((p) => p.name);
  const pickText = picks.length > 1 ? `${picks[0]} and ${picks.length - 1} more` : picks[0];

  // 0) Chat mein abhi complaint ki hai: model kuch bhi kahe, maafi + madad (rule-based safety net)
  if (chat.complaints > 0 && riskLevel === 'Low') {
    return {
      reason: 'Made a complaint in chat recently',
      type: 'support',
      action: 'Follow up on the complaint and offer free delivery on the next order.',
      channel: 'Call + Email',
      message: `Hi ${first}, we are sorry about your recent experience. Our team is looking into your complaint, and your next delivery is free with code {CODE}.`,
      coupon: { prefix: 'SORRY', type: 'shipping', value: 0, days: 14, description: 'Free delivery, our apology' },
    };
  }

  // 1) Complaint sab se pehle — discount se pehle maafi
  if (complain === 1 && riskLevel !== 'Low') {
    return {
      reason: chat.complaints > 0 ? 'Made a complaint in chat recently' : 'Raised a complaint recently',
      type: 'support',
      action: 'Personal apology call + free delivery on the next order.',
      channel: 'Call + Email',
      message: `Hi ${first}, we are sorry about your recent experience. Our team will call you shortly, and your next delivery is free with code {CODE}.`,
      coupon: { prefix: 'SORRY', type: 'shipping', value: 0, days: 14, description: 'Free delivery, our apology' },
    };
  }

  // 2) Chat mein return / refund / cancel poocha: pehle madad, discount nahi
  if (chat.refundAsks > 0 && riskLevel !== 'Low') {
    return {
      reason: 'Asked about a return or refund in chat',
      type: 'support',
      action: 'Call to help with the return or exchange before they leave.',
      channel: 'Call + Email',
      message: `Hi ${first}, we noticed you had a question about a return or exchange. Our team is happy to help: just reply to this email or message us on WhatsApp at 0332 8649439.`,
    };
  }

  if (riskLevel === 'High') {
    if (days >= 30) {
      return {
        reason: `No order in ${days} days`,
        type: 'discount',
        action: 'Send a "We miss you" 30% off code, valid for 7 days.',
        channel: 'SMS + Email',
        message: `Hi ${first}, we miss you! Here is 30% off your next order with code {CODE} (valid 7 days).`,
        coupon: { prefix: 'MISSYOU', type: 'percent', value: 30, days: 7, description: '30% off, we miss you' },
      };
    }
    // Skin Assistant ne products suggest kiye, customer ne khareede nahi: unhi par offer
    if (picks.length) {
      return {
        reason: `Liked ${pickText} in the Skin Assistant but did not buy`,
        type: 'discount',
        action: 'Send 20% off on the products the Skin Assistant picked, valid for 7 days.',
        channel: 'Email',
        message: `Hi ${first}, still thinking about ${pickText}? Your Skin Assistant picks are waiting, and here is 20% off with code {CODE} (valid 7 days).`,
        coupon: { prefix: 'PICKS', type: 'percent', value: 20, days: 7, description: '20% off your Skin Assistant picks' },
      };
    }
    if (orders <= 2) {
      return {
        reason: orders === 0
          ? 'Signed up but never ordered'
          : `Only ${orders} order${orders === 1 ? '' : 's'} so far, not a habit yet`,
        type: 'discount',
        action: orders === 0
          ? 'Give a PKR 500 coupon on the first order.'
          : 'Give a PKR 500 coupon on the second/third order.',
        channel: 'SMS + Email',
        message: `Hi ${first}, enjoy PKR 500 off your next MINAYSH order over PKR 1,500 with code {CODE} (valid 7 days).`,
        coupon: { prefix: 'COMEBACK', type: 'fixed', value: 500, minOrder: 1500, days: 7, description: 'PKR 500 off over PKR 1,500' },
      };
    }
    return {
      reason: 'Order activity has dropped',
      type: 'discount',
      action: 'Early access to the next sale + 20% off.',
      channel: 'Email + Push',
      message: `Hi ${first}, you get early access to our next sale, plus 20% off with code {CODE} (valid 7 days).`,
      coupon: { prefix: 'GLOW', type: 'percent', value: 20, days: 7, description: '20% off, early access' },
    };
  }

  if (riskLevel === 'Medium') {
    if (picks.length) {
      return {
        reason: `Liked ${pickText} in the Skin Assistant but did not buy`,
        type: 'reminder',
        action: 'Remind them of the products the Skin Assistant picked for their skin.',
        channel: 'Email',
        message: `Hi ${first}, your Skin Assistant picks (${pickText}) are still waiting for you. Come take another look!`,
      };
    }
    return {
      reason: tenure < 3
        ? 'New customer, buying habit not built yet'
        : `Last order ${days} days ago, slowing down`,
      type: 'reminder',
      action: 'Friendly reminder with new arrivals / restock of favourites.',
      channel: 'Email',
      message: chat.skinConcerns?.length
        ? `Hi ${first}, new arrivals for ${chat.skinConcerns[0]} just landed, picked for the skin goals you shared with our Skin Assistant. Come take a look!`
        : `Hi ${first}, your favourites are back in stock and new arrivals just landed. Come take a look!`,
    };
  }

  // Low risk: discount ki zaroorat nahi
  return {
    reason: `Regular buyer: ${orders} order${orders === 1 ? '' : 's'}, last one ${days} days ago`,
    type: null,
    action: 'No discount needed. Only send new arrivals and a thank-you note, offers here would just cut profit.',
    channel: 'Newsletter',
    message: null,
  };
};

const recentlyMessaged = async (userId) => {
  const since = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
  return EngagementMessage.exists({ userId, sentAt: { $gte: since } });
};

/**
 * Message bhejta hai (abhi sirf DB mein record — SMS/Email gateway baad mein lag sakta hai).
 * force = true ho to cooldown ignore (admin ka manual button).
 */
const sendEngagement = async ({ user, features, prediction, trigger = 'auto', force = false, chat = {} }) => {
  const suggestion = buildSuggestion(features, prediction.riskLevel, user.name, chat);
  if (!suggestion.type) return null; // Low risk
  if (!force && (await recentlyMessaged(user.id))) return null;

  // Discount / support message: is customer ka apna ek-dafa wala code
  let couponCode = null;
  let message = suggestion.message;
  if (suggestion.coupon) {
    try {
      const coupon = await createPersonalCoupon({ userId: user.id, ...suggestion.coupon });
      couponCode = coupon.code;
    } catch (error) {
      console.error('[engagement] coupon failed:', error.message);
    }
    message = couponCode
      ? message.replace('{CODE}', couponCode)
      : message.replace(/ with code \{CODE\}/, '').replace('{CODE}', '');
  }

  // Email channel ho to asli email jati hai. SMS / Call / Push ke liye abhi sirf record banta hai
  // (SMS ke liye Twilio jaisa provider chahiye).
  let status = 'sent';
  if (/email/i.test(suggestion.channel) && user.email) {
    const result = await sendEngagementEmail({ email: user.email, name: user.name, message, type: suggestion.type, couponCode });
    if (!result.sent && !result.logged) status = 'failed';
  }

  return EngagementMessage.create({
    userId: user.id,
    name: user.name,
    email: user.email,
    type: suggestion.type,
    channel: suggestion.channel,
    message,
    couponCode,
    riskLevel: prediction.riskLevel,
    churnProbability: prediction.churnProbability,
    trigger,
    status,
  });
};

module.exports = { buildSuggestion, sendEngagement, COOLDOWN_DAYS };
