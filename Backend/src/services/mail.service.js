// Email bhejne ki service (nodemailer + Gmail SMTP).
// .env mein SMTP_USER aur SMTP_PASS (Gmail App Password) na hon to email
// sirf terminal mein print hoti hai — website phir bhi chalti rehti hai.
// Email fail ho jaye to bhi order / signup fail NAHI hota.

const FRONTEND_URL = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
const STORE = 'MINAYSH';

let transporter = null;
let nodemailerMissing = false;

const isConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (transporter || nodemailerMissing || !isConfigured()) return transporter;
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch {
    nodemailerMissing = true;
    console.warn('[mail] nodemailer install nahi hai — Backend folder mein "npm install" chalayein.');
    return null;
  }
  const port = Number(process.env.SMTP_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

const mailStatus = () =>
  isConfigured()
    ? `SMTP ready (${process.env.SMTP_USER})`
    : 'SMTP not configured — emails will be printed in this terminal';

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const pkr = (n) => `PKR ${Math.round(Number(n) || 0).toLocaleString('en-PK')}`;

/** Sab emails ka ek hi design */
const layout = (title, bodyHtml) => `<!doctype html>
<html><body style="margin:0;background:#f7f1ee;font-family:Arial,Helvetica,sans-serif;color:#2b2326">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden">
        <tr><td style="background:#2b2326;padding:22px 28px;color:#f3d9d1;font-size:20px;letter-spacing:4px;font-weight:bold">${STORE} ✦</td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 16px;font-size:20px;color:#2b2326">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#faf6f4;font-size:11px;color:#8c7a80">
          ${STORE} — Beauty, made personal. This email was sent from ${escapeHtml(FRONTEND_URL())}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const button = (href, label) =>
  `<p style="margin:22px 0"><a href="${escapeHtml(href)}" style="background:#b76e79;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;display:inline-block">${escapeHtml(label)}</a></p>`;

/**
 * Email bhejo. Kabhi throw nahi karta.
 * @returns {Promise<{ sent: boolean, logged?: boolean, error?: string }>}
 */
const logEmail = (entry) => {
  try {
    // Lazy require: Mongo model (circular import se bachne ke liye)
    const EmailLog = require('../models/mongo/emailLog.model');
    EmailLog.create(entry).catch(() => {});
  } catch {
    // ignore
  }
};

const sendMail = async ({ to, subject, html, text, type = 'general' }) => {
  if (!to) return { sent: false, error: 'No recipient' };
  const t = getTransporter();

  if (!t) {
    console.log(`\n[mail:not-sent] To: ${to}\n  Subject: ${subject}\n  ${text || ''}\n`);
    logEmail({ to, subject, type, status: 'not_configured' });
    return { sent: false, logged: true };
  }

  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || `"${STORE}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`[mail] sent "${subject}" -> ${to}`);
    logEmail({ to, subject, type, status: 'sent' });
    return { sent: true };
  } catch (error) {
    console.error(`[mail] failed "${subject}" -> ${to}: ${error.message}`);
    logEmail({ to, subject, type, status: 'failed', error: error.message });
    return { sent: false, error: error.message };
  }
};

/* ------------------------------ Templates ------------------------------ */

const sendWelcome = (user) =>
  sendMail({
    to: user.email,
    type: 'welcome',
    subject: `Welcome to ${STORE}, ${user.name.split(' ')[0]}!`,
    text: `Hi ${user.name}, your ${STORE} account is ready. Start shopping: ${FRONTEND_URL()}`,
    html: layout(`Welcome, ${escapeHtml(user.name.split(' ')[0])}!`, `
      <p>Your ${STORE} account is ready. Explore skincare, makeup and fragrances picked for you.</p>
      ${button(FRONTEND_URL(), 'Start shopping')}`),
  });

const itemsTable = (items) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px">
    ${items.map((i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">
          <b>${escapeHtml(i.name)}</b>${i.shade ? ` <span style="color:#8c7a80">— ${escapeHtml(i.shade)}</span>` : ''}
          <br><span style="color:#8c7a80">Qty ${i.quantity}</span>
        </td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #eee">${pkr(i.price * i.quantity)}</td>
      </tr>`).join('')}
  </table>`;

const sendOrderConfirmation = (order, items) => {
  const a = order.shippingAddress || {};
  return sendMail({
    to: order.customerEmail,
    type: 'order',
    subject: `Order MN-${order.id} confirmed — ${STORE}`,
    text: `Thank you ${order.customerName}! Order MN-${order.id} placed. Total ${pkr(order.totalAmount)}.`,
    html: layout(`Thank you for your order!`, `
      <p>Hi ${escapeHtml(order.customerName || '')}, we have received your order <b>MN-${order.id}</b>.</p>
      ${itemsTable(items)}
      <table width="100%" style="font-size:13px;margin-top:10px">
        <tr><td>Subtotal</td><td align="right">${pkr(order.subtotal)}</td></tr>
        <tr><td>Shipping (${escapeHtml(order.delivery)})</td><td align="right">${pkr(order.shippingFee)}</td></tr>
        ${order.discount > 0 ? `<tr><td>Discount${order.couponCode ? ` (${escapeHtml(order.couponCode)})` : ''}</td><td align="right">− ${pkr(order.discount)}</td></tr>` : ''}
        <tr><td><b>Total</b></td><td align="right"><b>${pkr(order.totalAmount)}</b></td></tr>
      </table>
      <p style="font-size:13px;color:#5a4a50;margin-top:16px">
        <b>Deliver to:</b> ${escapeHtml([a.street, a.city, a.province, a.postal].filter(Boolean).join(', '))}<br>
        <b>Payment:</b> ${order.payment === 'cod' ? 'Cash on Delivery' : 'Card (we will confirm by phone)'}
      </p>
      ${button(`${FRONTEND_URL()}/account/orders/MN-${order.id}`, 'View your order')}`),
  });
};

const STATUS_TEXT = {
  pending: 'is pending',
  processing: 'is being prepared',
  shipped: 'has been shipped and is on its way',
  delivered: 'has been delivered',
  cancelled: 'has been cancelled',
};

const STATUS_EXTRA = {
  delivered: '<p>We hope you love your new beauty picks! If anything is not right, simply reply to this email or use Contact Us within 7 days.</p>',
  shipped: '<p>Your parcel is on its way and should arrive in 1–5 business days.</p>',
  cancelled: '<p>If you did not ask for this cancellation, please contact us and we will sort it out.</p>',
};

const sendOrderStatus = (order, email, name) =>
  sendMail({
    to: email,
    type: 'status',
    subject: `Order MN-${order.id} ${order.status} — ${STORE}`,
    text: `Hi ${name}, your order MN-${order.id} ${STATUS_TEXT[order.status] || order.status}.`,
    html: layout(`Your order ${STATUS_TEXT[order.status] || order.status}`, `
      <p>Hi ${escapeHtml(name || '')}, an update on order <b>MN-${order.id}</b>:
      it ${STATUS_TEXT[order.status] || `is now ${escapeHtml(order.status)}`}.</p>
      ${STATUS_EXTRA[order.status] || ''}
      ${button(`${FRONTEND_URL()}/account/orders/MN-${order.id}`, 'Track order')}`),
  });

const sendPasswordReset = (user, token) => {
  const link = `${FRONTEND_URL()}/reset-password?token=${encodeURIComponent(token)}`;
  return sendMail({
    to: user.email,
    type: 'reset',
    subject: `Reset your ${STORE} password`,
    text: `Hi ${user.name}, reset your password (valid 30 minutes): ${link}`,
    html: layout('Reset your password', `
      <p>Hi ${escapeHtml(user.name)}, we received a request to reset your password.
      This link works for <b>30 minutes</b>.</p>
      ${button(link, 'Choose a new password')}
      <p style="font-size:12px;color:#8c7a80">If you did not ask for this, you can ignore this email.</p>`),
  });
};

const sendContactAck = (name, email) =>
  sendMail({
    to: email,
    type: 'contact',
    subject: `We received your message — ${STORE}`,
    text: `Hi ${name}, thanks for contacting ${STORE}. We will reply within 1-2 business days.`,
    html: layout('Thanks for reaching out', `
      <p>Hi ${escapeHtml(name)}, we have received your message. Our team will reply within 1–2 business days.</p>`),
  });

const sendContactToAdmin = ({ name, email, message }) =>
  sendMail({
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    type: 'admin',
    subject: `New contact message from ${name}`,
    text: `${name} <${email}>: ${message}`,
    html: layout('New contact message', `
      <p><b>${escapeHtml(name)}</b> &lt;${escapeHtml(email)}&gt; wrote:</p>
      <blockquote style="margin:0;padding:12px 16px;background:#faf6f4;border-left:3px solid #b76e79">${escapeHtml(message).replace(/\n/g, '<br>')}</blockquote>`),
  });

const sendNewsletterWelcome = (email) =>
  sendMail({
    to: email,
    type: 'newsletter',
    subject: `You're on the ${STORE} list ✦`,
    text: `Thanks for subscribing to ${STORE}! You'll hear about new arrivals and exclusive offers first.`,
    html: layout("You're subscribed!", `
      <p>Thanks for joining the ${STORE} list. You'll be the first to hear about new arrivals, beauty edits and exclusive offers.</p>
      ${button(FRONTEND_URL(), 'Visit the store')}`),
  });

const sendCartReminder = (user, items) =>
  sendMail({
    to: user.email,
    type: 'cart',
    subject: `You left something in your bag, ${user.name.split(' ')[0]} ✦`,
    text: `Hi ${user.name}, your MINAYSH bag is waiting: ${items.map((i) => i.name).join(', ')}. ${FRONTEND_URL()}/cart`,
    html: layout('Your bag is waiting for you', `
      <p>Hi ${escapeHtml(user.name.split(' ')[0])}, you left these in your bag — they're still saved for you:</p>
      ${itemsTable(items)}
      <p style="font-size:13px;color:#5a4a50">Popular items sell out fast, so don't wait too long.</p>
      ${button(`${FRONTEND_URL()}/cart`, 'Complete my order')}`),
  });

const sendEngagementEmail = ({ email, name, message, type, couponCode }) =>
  sendMail({
    to: email,
    type: 'engagement',
    subject: type === 'support' ? `We're sorry, ${name.split(' ')[0]} — ${STORE}` : `A little something for you, ${name.split(' ')[0]} ✦`,
    text: message,
    html: layout(type === 'support' ? 'We want to make it right' : 'We miss you!', `
      <p>${escapeHtml(message)}</p>
      ${couponCode ? `<p style="margin:18px 0;text-align:center"><span style="display:inline-block;padding:12px 22px;border:2px dashed #b76e79;border-radius:10px;font-size:20px;font-weight:bold;letter-spacing:3px;color:#2b2326">${escapeHtml(couponCode)}</span><br><span style="font-size:12px;color:#8c7a80">Enter this code in your bag or at checkout</span></p>` : ''}
      ${button(`${FRONTEND_URL()}/cart`, 'Shop now')}`),
  });

/** Wishlist / cart wala product wapas stock mein, ya price kam */
const sendProductAlert = ({ user, product, kind, oldPrice, from }) => {
  const first = user.name.split(' ')[0];
  const where = from === 'cart' ? 'in your bag' : 'on your wishlist';
  const link = `${FRONTEND_URL()}/product/${encodeURIComponent(product.sku)}`;
  const isRestock = kind === 'restock';
  const subject = isRestock
    ? `Back in stock: ${product.name} ✦`
    : `Price drop: ${product.name} is now ${pkr(product.price)}`;
  return sendMail({
    to: user.email,
    type: isRestock ? 'restock' : 'price_drop',
    subject,
    text: `Hi ${first}, ${product.name} (${where}) ${isRestock ? 'is back in stock' : `dropped from ${pkr(oldPrice)} to ${pkr(product.price)}`}. ${link}`,
    html: layout(isRestock ? 'Good news — it’s back!' : 'The price just dropped', `
      <p>Hi ${escapeHtml(first)}, an item ${where} ${isRestock ? 'is <b>back in stock</b>' : 'is now <b>cheaper</b>'}:</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;border:1px solid #eee;border-radius:10px">
        <tr>
          ${product.imageUrl ? `<td width="90" style="padding:12px"><img src="${escapeHtml(FRONTEND_URL() + product.imageUrl)}" width="72" alt="" style="border-radius:8px;display:block"></td>` : ''}
          <td style="padding:12px;font-size:14px">
            <b>${escapeHtml(product.name)}</b><br>
            ${isRestock
              ? `<span style="color:#2E7D42">In stock now — ${pkr(product.price)}</span>`
              : `<span style="text-decoration:line-through;color:#8c7a80">${pkr(oldPrice)}</span> <b style="color:#b76e79">${pkr(product.price)}</b>`}
          </td>
        </tr>
      </table>
      <p style="font-size:13px;color:#5a4a50">${isRestock ? 'Popular items sell out fast — grab yours before it is gone again.' : 'Prices can change any time.'}</p>
      ${button(link, isRestock ? 'Shop now' : 'See the new price')}`),
  });
};

/** Admin Inbox wala alert email pe bhi */
const sendAdminAlert = ({ title, body, link }) =>
  sendMail({
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    type: 'admin',
    subject: `[MINAYSH Admin] ${title}`,
    text: `${title}\n${body}${link ? `\n${FRONTEND_URL()}${link}` : ''}`,
    html: layout(escapeHtml(title), `
      <p style="white-space:pre-line">${escapeHtml(body)}</p>
      ${link ? button(`${FRONTEND_URL()}${link}`, 'Open in admin') : ''}`),
  });

module.exports = {
  sendMail,
  sendProductAlert,
  sendAdminAlert,
  mailStatus,
  isConfigured,
  escapeHtml,
  layout,
  sendWelcome,
  sendOrderConfirmation,
  sendOrderStatus,
  sendPasswordReset,
  sendContactAck,
  sendContactToAdmin,
  sendNewsletterWelcome,
  sendEngagementEmail,
  sendCartReminder,
};
