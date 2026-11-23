// Database mein save hui chats dikhata hai.
//   node scripts/show-chats.js          -> aakhri 5 chats
//   node scripts/show-chats.js 20       -> aakhri 20 chats
require('dotenv').config();
const mongoose = require('mongoose');
const connectMongo = require('../src/config/db.mongo');
const ChatSession = require('../src/models/mongo/chatSession.model');
const ChatMessage = require('../src/models/mongo/chatMessage.model');

(async () => {
  await connectMongo();
  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB connect nahi hua. MONGO_URI aur Atlas ka Network Access check karein.');
    process.exit(1);
  }
  const limit = Number(process.argv[2]) || 5;
  const total = await ChatSession.countDocuments();
  const sessions = await ChatSession.find().sort({ lastMessageAt: -1 }).limit(limit).lean();
  console.log(`Kul chats: ${total} | dikha rahe hain: ${sessions.length}\n`);
  for (const s of sessions) {
    console.log(`=== ${s.sessionId} | user: ${s.userId ?? 'guest'} | messages: ${s.messageCount} | skin: ${s.skinType ?? '-'} | concerns: ${s.concerns.join(', ') || '-'} | scan: ${s.usedScan ? 'haan' : 'nahi'}`);
    const msgs = await ChatMessage.find({ sessionId: s.sessionId }).sort({ createdAt: 1 }).lean();
    for (const m of msgs) {
      const text = (m.text || '').replace(/\s+/g, ' ').slice(0, 140);
      console.log(`  [${m.role}] ${m.hadImage ? '(tasveer) ' : ''}${text}${m.scan ? ' | scan: ' + JSON.stringify(m.scan) : ''}`);
    }
    console.log('');
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
