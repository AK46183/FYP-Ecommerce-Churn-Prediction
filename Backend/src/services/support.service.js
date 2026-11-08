// Contact Us form + Newsletter
const ContactMessage = require('../models/mongo/contactMessage.model');
const Subscriber = require('../models/mongo/subscriber.model');
const ApiError = require('../utils/ApiError');
const { EMAIL_RE } = require('../validators/auth.validator');
const { sendContactAck, sendNewsletterWelcome } = require('./mail.service');
const { notifyAdmin } = require('./notification.service');
const User = require('../models/postgres/user.model');

const TOPICS = { general: 'General question', order: 'Order issue', product: 'Product question', complaint: 'Complaint' };

const submitContact = async ({ name, email, message, topic, orderRef }, userId = null) => {
  const clean = {
    name: String(name || '').trim().slice(0, 100),
    email: String(email || '').trim().toLowerCase(),
    message: String(message || '').trim().slice(0, 3000),
    topic: TOPICS[topic] ? topic : 'general',
    orderRef: orderRef ? String(orderRef).trim().slice(0, 30) : null,
  };
  if (!clean.name) throw new ApiError(400, 'Name is required');
  if (!EMAIL_RE.test(clean.email)) throw new ApiError(400, 'Enter a valid email address');
  if (clean.message.length < 5) throw new ApiError(400, 'Please write a short message');

  const saved = await ContactMessage.create({ ...clean, userId });

  // Complaint: customer pe churn model ka "complain" flag
  let customer = null;
  if (clean.topic === 'complaint' || clean.topic === 'order') {
    customer = userId ? await User.findByPk(userId) : await User.findOne({ where: { email: clean.email } });
    if (clean.topic === 'complaint' && customer && customer.role === 'customer' && !customer.hasComplaint) {
      customer.hasComplaint = true;
      await customer.save();
    }
  }

  const isComplaint = clean.topic === 'complaint';
  notifyAdmin({
    type: isComplaint ? 'complaint' : 'message',
    title: `${isComplaint ? 'Complaint' : TOPICS[clean.topic]} from ${clean.name}`,
    body: `${clean.name} <${clean.email}>${clean.orderRef ? ` · Order ${clean.orderRef}` : ''}\n\n${clean.message}`
      + (isComplaint && customer ? '\n\n(Marked as complaint on this customer — churn risk will update on next scoring.)' : ''),
    link: '/admin/messages',
    meta: { messageId: saved.id, userId: customer?.id || userId },
  });
  sendContactAck(clean.name, clean.email);
  return { id: saved.id };
};

const getContactMessages = () => ContactMessage.find().sort({ createdAt: -1 }).limit(200);

const setContactStatus = async (id, status) => {
  const msg = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!msg) throw new ApiError(404, 'Message not found');
  return msg;
};

const subscribe = async ({ email, source }) => {
  const clean = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(clean)) throw new ApiError(400, 'Enter a valid email address');

  const existing = await Subscriber.findOne({ email: clean });
  if (existing?.active) return { email: clean, alreadySubscribed: true };

  if (existing) {
    existing.active = true;
    await existing.save();
  } else {
    await Subscriber.create({ email: clean, source: source || 'footer' });
  }
  sendNewsletterWelcome(clean);
  notifyAdmin({ type: 'subscriber', title: `New subscriber: ${clean}`, body: `${clean} joined the newsletter.`, link: '/admin/messages' });
  return { email: clean, alreadySubscribed: false };
};

const getSubscribers = () => Subscriber.find({ active: true }).sort({ createdAt: -1 });

module.exports = { submitContact, getContactMessages, setContactStatus, subscribe, getSubscribers };
