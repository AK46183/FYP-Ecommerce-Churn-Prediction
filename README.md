# FYP-Ecommerce-Churn-Prediction
AI-powered e-commerce platform with a rule-based chatbot and machine learning-based customer churn prediction (FYP, Bahria University Lahore)

# Backend 
FYP-Ecommerce-Churn-Prediction

AI-powered e-commerce platform with a rule-based chatbot and machine learning-based customer churn prediction (FYP, Bahria University Lahore).

Team
Backend, Database, Activity Logging, Admin API, Churn Service — Aysha
Frontend — Partner
Chatbot — Partner
Tech Stack
Layer	Tech
Frontend	React.js (Vite)
Backend	Node.js + Express.js
Primary database	PostgreSQL (Neon.tech) — users, products, cart, orders
Secondary database	MongoDB (Atlas) — activity logs, chat logs, churn scores
Churn model	Python, LightGBM (separate microservice)
Auth	JWT (JSON Web Tokens)
Version control	Git + GitHub (main / develop branches, PR workflow)
Backend — Status: Core Complete ✅

All endpoints below are implemented and tested via Postman.

Auth API
POST /api/auth/register — register new user
POST /api/auth/login — login, returns JWT token
Product API
GET /api/products — list all products
GET /api/products/:id — get single product (also logs a product_view activity event)
POST /api/products — add product
PUT /api/products/:id — update product
DELETE /api/products/:id — delete product
Cart API (requires auth token)
POST /api/cart — add item to cart (also logs a cart_add activity event)
GET /api/cart — view cart
DELETE /api/cart/:itemId — remove item from cart
Order API (requires auth token)
POST /api/orders/checkout — place order from cart
GET /api/orders — view logged-in user's order history
Admin API (requires auth token + admin role)
GET /api/admin/dashboard — total orders, revenue, products overview
GET /api/admin/orders — view all orders across all users
PATCH /api/admin/orders/:id/status — update an order's status
Activity Logging (MongoDB)

Automatically logs customer behavior — currently tracks product_view and cart_add events with userId, productId, and timestamp. This is the data source the churn prediction model will train on.

Not Yet Built
Frontend (React) — customer-facing UI, wires into the APIs above
Chatbot — rule-based intent-mapped chatbot (order status, product info, complaints)
Churn service (Python/LightGBM) — separate microservice, exposes /predict-churn
Churn integration (Node side) — connector to call the churn service once it exists
Engagement automation — auto-trigger retention messages for high-risk customers
Getting Started (Backend)
bash
cd backend
npm install

Create a .env file in backend/ with:

PORT=5000
POSTGRES_URI=<your Neon.tech connection string>
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any secret string>

Run the server:

bash
npm run dev

Expected output: PostgreSQL connected successfully, MongoDB connected successfully, Server running on port 5000.

Git Workflow
main — stable, protected (PR required to merge)
develop — integration branch, all work merges here first
Create a feature branch off develop for your work: git checkout -b feature/your-task-name
Push your branch and open a Pull Request into develop when ready
Getting Started (Frontend / Chatbot — for team members)
bash
git clone https://github.com/AK46183/FYP-Ecommerce-Churn-Prediction.git
cd FYP-Ecommerce-Churn-Prediction
git checkout develop
git checkout -b feature/frontend

All backend APIs above are live and tested — build against them directly. Base URL for local development: http://localhost:5000.