# MINAYSH Help Bot (rule-based chatbot)

Proposal: *"a structured chatbot with predefined intents and response mapping"* that helps customers with **FAQs, order tracking and basic complaint handling**.

This bot uses no AI or LLM. It is plain keyword matching plus fixed responses, so every answer can be explained and predicted. The AI Skincare Assistant (`/api/chatbot`) is a separate optional feature.

> The bot is connected to churn prediction: see [Chat → churn](#chat--churn) below. The churn model, `train.py` and the Kaggle data are unchanged.

## How it works

```
Customer message
   │
   ▼
normalize()        lowercase, remove punctuation, "salaaam" -> "salam"
   │
   ▼
detectIntent()     score each intent = sum of weights of its matched keywords
   │               highest score wins; score < 2 -> fallback (menu)
   ▼
response mapping
   ├─ FAQ intents      -> fixed reply from intents.js
   ├─ order_status     -> customer's orders from PostgreSQL
   └─ complaint        -> multi-step flow -> saved in MongoDB + admin alert
```

Quick-reply buttons send an `intent` directly, so no keyword matching is needed for them.

## Intents

| Intent | Example messages | Response |
|---|---|---|
| `greeting` | hi, salam, help | Welcome + menu |
| `order_status` | where is my order, mera order kahan hai, MN-12 | Live status from the database (signed-in customers only, their own orders) |
| `complaint` | my lipstick arrived broken, order kharab aya, nahi mila | Asks for the order, then the details (and an email for guests), saves the complaint, gives a ticket number |
| `faq_delivery` | delivery charges, kitne din | PKR 250 / 600, 3–5 / 1–2 days |
| `faq_returns` | refund, exchange, wapas | 7-day exchange policy |
| `faq_payment` | COD, card, jazzcash | Cash on delivery |
| `faq_cancel` | cancel my order | Possible while Pending / Processing |
| `faq_offers` | discount code, bundle | Bundle + coupon rules |
| `faq_account` | forgot password, sign up | Reset link |
| `faq_contact` | contact, timings | WhatsApp + Contact Us |
| `faq_skincare` | acne, oily skin | Points to the Skincare Assistant |
| `human_support` | real person, whatsapp | WhatsApp + Contact Us |
| `thanks`, `goodbye` | shukriya, allah hafiz | Short reply |
| `fallback` | anything else | "Didn't get that" + menu |

When scores tie, `complaint` wins over `order_status` ("mera order kharab aya" is a complaint, not a tracking request).

## Complaint flow

```
complaint ──► step "order"   (pick one of your orders / type MN-12 / "Not about an order")
          ──► step "details" (what went wrong)
          ──► step "email"   (guests only)
          ──► saved: ContactMessage { topic: 'complaint', source: 'helpbot' }
              + admin notification (Admin → Messages / Inbox)
              + reply with ticket number, e.g. C-B9C0D1
```

Typing `cancel` at any step stops the flow. The flow state is sent back by the browser with each message. The server checks it again every time: the order must belong to the signed-in customer, and `orderRef` must look like `MN-<number>`.

## API

`POST /api/helpbot/message` (token optional; guests can use FAQs and complaints)

```json
// request: type a message
{ "message": "where is my order", "state": null }
// or: a button
{ "intent": "faq_delivery" }

// response.data
{
  "intent": "order_status",
  "reply": "Your latest order MN-12 is Shipped. ...",
  "quickReplies": [{ "label": "Make a complaint", "intent": "complaint" }],
  "links": [{ "label": "All my orders", "to": "/account/orders" }],
  "orders": [{ "id": "MN-12", "status": "Shipped", "date": "Nov 20, 2026", "total": 3400, "items": 2, "firstItem": "..." }],
  "ticket": null,
  "state": null
}
```

Limits: 30 messages per minute per IP, 5 complaints per hour per IP, 500 characters per message.

## Files

| File | What |
|---|---|
| `src/chatbot/intents.js` | All intents, keywords (with weights) and fixed replies. **Add a new FAQ here.** |
| `src/services/helpbot.service.js` | Intent detection, order status, complaint flow |
| `src/controllers/helpbot.controller.js` | Connects the bot to the database, validates the request, logs chat activity, finds the customer's offer |
| `src/routes/helpbot.routes.js` | `POST /api/helpbot/message` + rate limit |
| `tests/helpbot.test.js` | 41 tests (no database needed): `npm test` |
| `tests/churnChat.test.js` | 12 tests for chat → churn |
| `frontend/src/components/chat/HelpBot.jsx/.css` | "Help & Orders" chat widget, bottom-left of every store page |

## Chat → churn

Chats are linked to customers by `userId`, which comes from the login token. Guest chats are not linked.

| Chat data (last 30 days) | Where it is used |
|---|---|
| Complaint (Help Bot or Contact Us) | **Model input**: sets `complain = 1`. Kaggle's `Complain` also means "a complaint last month". |
| Return / refund / cancel questions (Help Bot) | Reason in the churn report + a support message instead of a discount |
| Questions the bot could not answer | Reason in the churn report |
| Skin concerns (Skincare Assistant) | Medium-risk reminder mentions them |
| Products the Skin Assistant suggested but the customer never bought | Reason + a 20% offer on those products (High) or a reminder (Medium) |

Only the complaint goes into the model, because the model only knows its 4 Kaggle features. The other signals explain *why* a customer is at risk and pick the right message, without changing the model's score.

```
Help Bot / Skincare Assistant chat
   │  activity log: chat_query, chat_unanswered, chat_complaint  (+ ContactMessage, ChatSession, ChatMessage)
   ▼
churn.service.js  chatSignals()  ── complaint ──► buildFeatures(..., { recentComplaint })  ──► LightGBM (unchanged)
   │                              └─ other signals ─► reason + buildSuggestion(features, risk, name, chat)
   ▼
ChurnScore { features, riskLevel, chat, reason }  ──►  engagement email + personal coupon
   ▼
Customer opens the Help Bot  ──►  greeting shows their unused coupon (Medium / High risk only)  ──►  chat_offer_shown
```

Safety rules:
- A customer who complained in chat in the last 30 days gets an apology + free-delivery message even when the model says Low.
- Opening the admin Churn page only *scores* customers. Emails and coupons are sent only when the admin presses Run.
- The Help Bot never creates coupons. It only shows a personal coupon that churn engagement already sent and that is still valid and unused.
- Numbers in unanswered questions are masked before they are logged.

Admin view: on the **Churn** page, every customer card has a **Chat & cart signals** box (chats, complaints, refund questions, unanswered questions, cart left behind, Skin Assistant picks not bought, skin concerns). It shows when a chat complaint was sent to the model.

Tests: `tests/churnChat.test.js` (features, messages, report) and the offer tests in `tests/helpbot.test.js`.

## Adding a new FAQ

Add an object to `INTENTS` in `src/chatbot/intents.js`:

```js
{
  name: 'faq_gift_wrap',
  keywords: [['gift wrap', 4], ['gift', 2], ['wrapping', 3]],
  reply: 'Yes! Add a note at checkout and we gift-wrap your order for free.',
},
```

Then add a test line to `tests/helpbot.test.js`, for example `['do you gift wrap', 'faq_gift_wrap']`.
