# Backend: Admin + Churn complete

## Chalane ka tareeqa
1. **churn-service** (alag terminal):
   ```bash
   cd churn-service
   pip install -r requirements.txt
   uvicorn api.app:app --port 8000
   ```
2. **Backend**:
   ```bash
   npm install
   npm run seed     # sirf pehli dafa: admin + 15 demo customers + orders
   npm run dev
   ```
3. Login (Postman): `POST /api/auth/login` with `{ "email": "admin@minaysh.pk", "password": "Admin@123" }`. Jo `token` mile, use har admin request mein `Authorization: Bearer <token>` header mein bhejein.
4. Pehla scoring run: `POST /api/admin/churn/run`

`.env` mein 2 nayi lines hain: `CHURN_API_URL=http://localhost:8000` aur `AOV_TARGET=7000`.

## Churn flow (flowchart ke mutabiq)
```
Customers + Orders (Postgres)
  -> features: tenure_months, order_count, days_since_last_order, complain
  -> Python model (POST /predict-churn) -> probability + Low/Medium/High
  -> ChurnScore save (Mongo, history)
  -> High/Medium risk ko engagement message (rules: support / discount / reminder, 7 din cooldown)
  -> Admin: monthly report, alerts, message results (message ke baad order kiya ya nahi)
```
- `complain` feature = user ka `hasComplaint` flag. Chatbot nahi bana, is liye admin isay `PATCH /api/admin/customers/:id/complaint` se set karta hai.
- Engagement rules `src/services/engagement.service.js` mein hain:
  - complaint ho to **support** message
  - High risk aur 30+ din se order nahi to **30% discount**
  - High risk aur 1-2 orders to **PKR 500 coupon**
  - Medium risk to **reminder**
  - Low risk ko koi message nahi
- Messages abhi sirf DB mein "sent" record hote hain. SMS ya email bhejna ho to `sendEngagement` mein TODO wali jagah provider lagayein.

## Naye / updated endpoints (sab admin-only)
| Method | URL | Kaam |
|---|---|---|
| GET | `/api/admin/dashboard?range=7d\|30d\|90d` | Frontend dashboard ki poori shape (revenue bars, orders, customers, churn, AOV, top products, recent orders) |
| GET | `/api/admin/orders` | Saare orders, customer name aur product names ke saath |
| PATCH | `/api/admin/orders/:id/status` | `{status}`: pending / processing / shipped / delivered / cancelled |
| GET | `/api/admin/customers` | Customers + orders, total spent, latest churn risk |
| PATCH | `/api/admin/customers/:id/complaint` | `{hasComplaint: true/false}` |
| GET | `/api/admin/churn?year=2026&month=11` | Monthly churn report (frontend `buildChurnMonth` jaisi shape). Is mahine ka data na ho to khud scoring chala deta hai |
| POST | `/api/admin/churn/run` | Saare customers ko score karo `{autoEngage?: true}` |
| GET | `/api/admin/churn/health` | Python service online hai ya nahi |
| GET | `/api/admin/churn/alerts` | High-risk customers + un ka last message |
| GET | `/api/admin/churn/customers?risk=High` | Har customer ka latest score |
| GET | `/api/admin/churn/customers/:userId` | Ek customer ka live prediction + history |
| GET | `/api/admin/churn/engagements` | Bheje gaye messages + converted ya nahi + conversion rate |
| POST | `/api/admin/churn/engagements/:userId` | Manual message bhejo |
| GET / POST / DELETE | `/api/admin/sales`, `/api/admin/sales/upcoming`, `/api/admin/sales/:id` | Sale events (Mongo) |
| GET / POST / DELETE | `/api/admin/strategies?season=summer`, `/api/admin/strategies/:id` | Marketing strategies (Mongo) |

## Fixes
- `POST/PUT/DELETE /api/products` ab sirf admin ke liye hain (pehle koi bhi kar sakta tha).
- `GET /api/products/:id` ab guest bhi dekh sakta hai. Login ho to `product_view` log hota hai.
- Activity logs mein `login`, `checkout`, `cart_remove` bhi record hote hain. Churn report ka "Cart abandoned" driver inhi se banta hai.
- `sequelize.sync({ alter: true })` lagaya hai, taake naye columns (`city`, `phone`, `hasComplaint`) purani `users` table mein add ho jayein.

## Nayi / badli files
- Nayi: `models/mongo/engagementMessage.model.js`, `saleEvent.model.js`, `strategy.model.js`, `services/churn.service.js`, `services/admin.service.js`, `scripts/seed.js`
- Pehle khaali thi, ab bhari: `churn.controller.js`, `churn.routes.js`, `churnClient.service.js`, `engagement.service.js`, `churnScore.model.js`, `order.validator.js`
- Updated: `user.model.js`, `admin.controller.js`, `admin.routes.js`, `product.routes.js`, `auth.middleware.js`, `order.service.js`, `auth.service.js`, `activityLogger.middleware.js`, `server.js`, `package.json`, `.env`
- Chatbot wali files ko nahi chheda gaya.

## Frontend connect karte waqt
- Backend har jawab `{ statusCode, data, message }` mein bhejta hai, to frontend mein `(await res.json()).data` lena hai.
- Admin calls mein token header zaroori hai (warna 401).
- `churnApi.js`, `adminApi.js`: `USE_MOCK = false`. Shape same rakhi gayi hai.
- `saleApi.js` / `strategyApi.js`: backend sirf admin ke banaye hue items deta hai. Ready-made `defaultEvents` / season strategies frontend mein hi merge karein.
