# MINAYSH: AI-Driven E-Commerce System

Final Year Project, Bahria University Lahore.

MINAYSH is a full online beauty and skincare store with three AI features:

1. **Customer churn prediction.** A LightGBM model scores every customer as Low, Medium or High risk of leaving. The admin panel then suggests and sends retention offers.
2. **AI skin assistant chatbot.** An LLM chatbot answers skincare questions from a checked knowledge base (RAG) and recommends real products from the store.
3. **Face skin scan.** A customer can upload or take a selfie. The assistant estimates visible skin concerns such as oiliness, acne and dryness, then suggests products. This is a cosmetic estimate, not a medical diagnosis.

It also has a **rule-based Help Bot** ("Help & Orders"): a structured chatbot with predefined intents that answers FAQs, tracks orders and takes complaints. It uses keyword matching and fixed responses, with no AI.

## Team

| Area | Member |
|---|---|
| Backend, database, activity logging, admin API, churn service | Aysha |
| Frontend | Partner |
| Chatbot (skincare-ai) | Partner |

## Architecture

```
                 React (Vite) storefront + admin panel
                               |
                               v
                 Node.js / Express API  (Backend, port 5000)
                 |          |              |               |
                 v          v              v               v
           PostgreSQL    MongoDB      churn-service    skincare-ai
           (Neon)        (Atlas)      FastAPI + LightGBM   Python + Gemini LLM
           users,        activity     port 8000        RAG + face scan
           products,     logs, chats,                  port 8001
           orders,       churn scores,
           coupons       notifications
```

The frontend only talks to the Node backend. The backend calls the two Python services. The skin assistant is protected with a shared service key. The rule-based Help Bot runs inside the Node backend (`/api/helpbot`), so it needs no extra service.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Framer Motion |
| Backend | Node.js, Express 5, Sequelize, Mongoose, JWT, bcrypt, Nodemailer |
| Main database | PostgreSQL (Neon): users, products, carts, orders, coupons, addresses, wishlist |
| Log database | MongoDB (Atlas): activity logs, chat logs, churn scores, notifications, emails |
| Churn model | Python, LightGBM, scikit-learn, FastAPI |
| Skin assistant | Python (standard library HTTP server), Google Gemini (Claude optional), RAG over a signed knowledge base |
| Hosting | Vercel (frontend), Render (backend and both Python services) |

## Features

### Customer storefront
- Product listing with search, categories and pages of 48 products. Product pages include shades and sizes, each with its own price and stock.
- Cart (works for guests, and is saved to the account after login) with live stock and price checks.
- Checkout with Cash on Delivery or card, standard or express delivery, coupon codes, and the bundle deal (PKR 1,000 off every 3 different products, for bundles of PKR 3,000 or more).
- Account area: profile, password change, saved addresses, wishlist, order history and order details.
- Sign up, login, Google sign-in, and forgot / reset password by email.
- NEW drop countdown page, tips and trends, help centre, contact form, newsletter and WhatsApp button.
- Help pages for delivery options, payment methods, return policy, privacy policy and terms, plus a Track Your Order page (enter an order number and see its status timeline).
- **Help & Orders bot** (bottom-left): rule-based chatbot with 16 predefined intents in English and Roman Urdu. It answers FAQs (delivery, returns, payment, cancellation, offers, account), shows the live status of the customer's own orders, and takes complaints step by step (order, then details, then a ticket number). Complaints go to Admin, then Inbox, and the admin gets an alert.
- Skin assistant chat widget with an optional live face scan.

### Admin panel
- Dashboard: revenue, orders, revenue change, upcoming sale and low-stock alerts.
- Products, categories, inventory, orders (with status emails to customers), customers and messages.
- Inbox: store alerts, contact messages and Help Bot complaints, plus a log of every email sent (old "Not sent (SMTP off)" records can be cleared).
- Churn page: run model scoring, see at-risk customers, and send engagement emails.
- Strategy builder (retention offers suggested from the churn results), coupons, promotions, bundles, sale events and abandoned-cart reminders.
- Marketing poster studio, homepage content and saved chatbot conversations.

### Security
- Passwords hashed with bcrypt. JWT login tokens expire after 7 days and stop working immediately when the password is changed or reset.
- The user's role is checked against the database on every request, so removing someone's admin role takes effect immediately.
- Rate limits on login, password reset, coupons, forms and the chatbot (this protects against spam and AI cost abuse).
- Prices, stock, coupons and bundle discounts are always recalculated on the server. Checkout runs in one database transaction with row locks.
- Phone numbers and addresses are encrypted in the database (AES-256-GCM).
- Security headers, a CORS allow-list, and error messages that never show internal details.
- Card numbers, CNICs and OTPs are masked before chats are saved. The face scan photo is never stored.

## Churn model

- **Training data:** the public Kaggle "E Commerce Dataset" (`churn-service/data/raw`), because a new store has no churn history yet.
- **Features:** `tenure_months`, `order_count`, `days_since_last_order` and `complain`. The backend calculates these same four values for each real MINAYSH customer from their orders and the admin's complaint flag.
- **Model:** LightGBM with class weighting (`scale_pos_weight`) for the imbalanced data and an 80/20 stratified train/test split.
- **Preprocessing:** missing values are filled with the median. No feature scaling is needed, because LightGBM is a tree-based model and is not affected by the scale of the features.
- **Risk levels:** probability < 0.15 is Low, < 0.40 is Medium, and anything higher is High.
- Retrain with: `cd churn-service && python model/train.py`

## Project structure

```
Backend/          Node.js API (src/routes, controllers, services, models, middlewares)
  src/chatbot/    Help Bot intents, keywords and fixed replies (see Backend/HELPBOT.md)
  tests/          Automated tests (npm test)
  scripts/        Seeding, backups, restock, admin password, data encryption
frontend/         React storefront + admin panel
churn-service/    FastAPI churn prediction service + training code + model
skincare-ai/      Skin assistant: LLM, RAG knowledge base, face scan, safety checks
render.yaml       Render blueprint (deploys backend + both Python services)
```

## Running locally

You need Node.js 20+, Python 3.11+, a PostgreSQL database (for example Neon) and a MongoDB database (for example Atlas).

### 1. Environment files
Copy each `.env.example` to `.env` and fill it in:
- `Backend/.env.example`: database URLs, `JWT_SECRET`, `DATA_ENCRYPTION_KEY`, service URLs, email settings
- `skincare-ai/.env.example`: `GEMINI_API_KEY`, `SKINCARE_SERVICE_KEY`, `KB_MANIFEST_KEY`
- `frontend/.env.example`: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`

To generate random keys, run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Never commit a `.env` file.

### 2. Install (first time only)
```bash
cd Backend && npm install && npm run seed:catalog
cd ../frontend && npm install
cd .. && python -m venv .venv
.venv/Scripts/pip install -r churn-service/requirements.txt -r skincare-ai/requirements.txt
```

### 3. Start the four services (one terminal each)

| Terminal | Folder | Command | Port |
|---|---|---|---|
| 1 | `churn-service` | `../.venv/Scripts/python -m uvicorn api.app:app --port 8000` | 8000 |
| 2 | `skincare-ai` | `../.venv/Scripts/python server.py` | 8001 |
| 3 | `Backend` | `npm run dev` | 5000 |
| 4 | `frontend` | `npm run dev` | 5173 |

Open http://localhost:5173. More detail, including email and Google sign-in setup, is in [Backend/SETUP_FULL.md](Backend/SETUP_FULL.md).

**Email:** without SMTP settings, emails are only printed in the backend terminal. To send real emails with Gmail, turn on 2-Step Verification, create an App Password, and set `SMTP_USER`, `SMTP_PASS` (the App Password, not your Gmail password), `MAIL_FROM` and `ADMIN_EMAIL` in `Backend/.env`. On start the backend prints `Email: SMTP ready (...)`.

## Tests

```bash
cd Backend && npm test                    # 106 tests: auth, tokens, checkout, stock, bundle deal, validation, encryption, chat masking, rate limits, Help Bot intents / order status / complaints
cd skincare-ai && python test_modules.py  # skin assistant modules (no API key needed)
cd skincare-ai && python test_security.py # prompt-injection and knowledge-base safety checks
cd frontend && npm run lint
```

The backend tests use Node's built-in test runner and never touch a real database.

## Deployment

- **Backend and Python services:** on Render, choose New, then Blueprint, then this repo (`render.yaml`). Render will ask for the secret values.
- **Frontend:** on Vercel, set the root directory to `frontend` and set `VITE_API_URL` to the Render backend URL followed by `/api`.

## Git workflow

- `main` is the stable branch and is protected (a pull request is needed to merge).
- `develop` is the integration branch.
- Create feature branches with `git checkout -b feature/your-task`, then open a pull request.