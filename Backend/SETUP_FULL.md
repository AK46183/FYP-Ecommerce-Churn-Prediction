# MINAYSH: poora setup (frontend + backend + emails)

## 1. Files lagayein
1. Purane `Backend` folder ka naam badal kar `Backend-old2` kar dein (backup).
2. `Backend-full.zip` extract karein. Naya `Backend` folder wahin rakhein jahan purana tha.
3. `frontend-full-files.zip` ko `minaysh frontend` folder ke **andar** extract karein, aur Windows puche to **Replace** chunein.

## 2. Backend (pehli dafa)
`Backend` folder mein:
```powershell
npm install
npm run seed:catalog
```
- `npm install` se `nodemailer` (email) bhi install ho jayega.
- `seed:catalog` website ke 512 products database mein daalta hai, har product ka stock 50.
- Purane admin, customers, orders aur churn data waise hi rahenge. `npm run seed` dobara chalane ki zaroorat nahi.

## 3. Teen terminals (har dafa)
| Terminal | Folder | Command |
|---|---|---|
| 1 | churn-service | `& "..\.venv\Scripts\python.exe" -m uvicorn api.app:app --port 8000` |
| 2 | Backend | `npm run dev` |
| 3 | minaysh frontend | `npm run dev` |

Backend terminal mein ye lines aani chahiyen: `PostgreSQL connected`, `MongoDB connected`, `Server running on port 5000`, aur ek line `Email: ...`.

## 4. Emails (Gmail App Password)
Jab tak ye set nahi hota, har email backend terminal mein `[mail:not-sent]` ke saath print hoti hai, aur baqi sab chalta rehta hai.

1. [myaccount.google.com](https://myaccount.google.com) kholein, phir **Security**.
2. **2-Step Verification** ON karein (agar pehle se nahi).
3. Upar search mein **App passwords** likhein aur kholein.
4. App name mein `MINAYSH` likhein, phir **Create**. 16 letters ka code milega (maslan `abcd efgh ijkl mnop`).
5. `Backend\.env` mein likhein (code se spaces hata dein):
   ```
   SMTP_USER=aapki.email@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ADMIN_EMAIL=aapki.email@gmail.com
   ```
6. Backend terminal mein `rs` likh kar Enter dabayein. Ab `Email: SMTP ready (...)` aana chahiye.
7. Check: Admin, phir **Messages**, phir **Email setup**, phir **Send test email**.

**Kab kaunsi email jati hai:**
| Kab | Kis ko |
|---|---|
| Sign Up | Customer: welcome |
| Order place | Customer: order confirmation (items, total, address) |
| Admin order status badle | Customer: status update |
| Forgot password | Customer: reset link (30 minute) |
| Contact Us form | Customer: "message mil gaya"; Admin: poora message |
| Newsletter subscribe | Customer: welcome |
| Churn scoring / Send message | At-risk customer: engagement email (discount / reminder / support) |

Demo customers ki emails `@example.com` hain jo asli nahi. Engagement email test karni ho to apni asli email se Sign Up karein.

## 5. Google Sign-In (optional)
1. [console.cloud.google.com](https://console.cloud.google.com) pe naya project banayein.
2. **APIs & Services**, phir **OAuth consent screen**:
   - External chunein
   - App name `MINAYSH`, aur apni email
   - **Test users** mein apni Gmail add karein
3. **Credentials**, phir **Create credentials**, phir **OAuth client ID**:
   - Type: **Web application**
   - **Authorized JavaScript origins**: `http://localhost:5173`
4. Jo **Client ID** mile (`....apps.googleusercontent.com`), wo do jagah likhein:
   - `Backend\.env` mein: `GOOGLE_CLIENT_ID=...`
   - `minaysh frontend\.env` mein: `VITE_GOOGLE_CLIENT_ID=...`
5. Backend aur frontend dono restart karein.

## 6. Kya kya ab backend se chalta hai
**Customer side**
- **Login / Sign Up / Google:** account Postgres mein
- **Checkout:** order backend mein, price aur stock server check karta hai, stock kam hota hai, email jati hai, aur churn model mein count hota hai
- **My Orders / Order Details:** asli orders, status steps ke saath
- **Wishlist:** login ho to account mein save. Guest ki list login pe account mein mil jati hai
- **Addresses:** add, delete, default. Default address checkout pe khud bhar jata hai
- **Profile:** naam, phone, city, aur password change
- **Forgot Password:** email link se naya password (`/reset-password` page)
- **Contact Us** aur **Newsletter:** MongoDB mein save, aur email
- **Activity:** product dekhna aur cart mein daalna/nikalna. Isse churn report ka "Cart abandoned" banta hai

**Cart**
- **Account cart:** login customer ka cart account mein save hota hai. Dusre browser ya phone pe bhi wahi cart milta hai, aur guest wale items login pe mil jate hain
- **Live check:** cart aur drawer mein "Only 2 left", "Sold out" ya "Hurry — only 3 left" dikhta hai. Masla ho to checkout band rehta hai
- **Discount codes:** cart aur checkout mein code box hai, aur server har code dobara check karta hai
  - `WELCOME10` khud bana hota hai: 10% off, PKR 2,000 se upar
  - Churn engagement emails mein har customer ka **apna** ek-dafa wala code jata hai (`MISSYOU-…`, `COMEBACK-…`, `GLOW-…`, `SORRY-…` free delivery), 7–14 din ke liye
  - Churn page ke Engagement results mein dikhta hai ke code use hua ya nahi
- **Abandoned cart email:** cart 24 ghante tak chhoda hua ho aur order na hua ho, to reminder email jati hai. Backend har ghante khud check karta hai; admin Promotions mein button se abhi bhi bhej sakta hai

**Emails jo customer ko khud jati hain**
- Order confirmation, aur har status pe update (processing, shipped, **delivered**, cancelled)
- Newsletter welcome
- **Wishlist (like) ya cart wala product wapas stock mein aaye:** "Back in stock" email
- **Wishlist ya cart wale product ki price kam ho:** "Price drop" email (24 ghante mein ek dafa)
- Order cancel hone pe stock khud wapas ho jata hai

**Admin Inbox (sidebar mein "Inbox", laal badge ke saath)**, sath mein admin ki email pe bhi:
- 🛒 Naya order: customer, items, city, payment, coupon
- 📦 Order delivered / cancelled
- 👤 Naya customer register hua (email ya Google)
- ⚠️ Complaint: Contact Us form mein "Complaint" chunne pe aati hai, aur us customer pe churn ka complaint flag khud lag jata hai
- 📉 Product ka stock 5 ya kam ho gaya
- Tabs: **Inbox · Sent emails** (har customer email ka record) **· Contact messages · Newsletter · Email setup**
- Admin email kis alert pe jaye, ye `.env` ki `ADMIN_EMAIL_ALERTS` se badal sakti hain (maslan `order,complaint`)

**Admin side**
- **Promotions (ab asli):** discount codes banana / band karna, aur Abandoned carts ki list
- Dashboard, Churn, Orders (status change pe email), Customers, Sale, Marketing (pehle se)
- **Products:** 512 products, search, price edit, Active/Hidden
- **Inventory:** stock edit, Low stock / Out of stock filters
- **Categories:** har category ke products aur stock
- **Messages (naya):** Contact messages, newsletter subscribers, email test

**Abhi bhi asli nahi:** card payment, SMS, Chatbot, aur static admin pages (Bundles, Homepage Content, Tips & Trends, Reports, Settings).

## 7. Test (5 minute)
1. Apni asli email se **Sign Up** karein. Welcome email aani chahiye.
2. Koi product cart mein daalein, **Checkout**, phir **Place Order**. Aap My Orders pe pohanchengi, aur confirmation email aayegi.
3. Admin se login karein (`admin@minaysh.pk` / `Admin@123`), phir **Orders** mein us order ka status `shipped` karein. Customer ko email jayegi.
4. Admin **Inventory** mein us product ka stock 1 kam nazar aayega.
5. Admin **Churn**, phir **Run scoring**. Naya customer bhi score hoga.
6. Logout karein, phir **Forgot password**. Email ka link khol kar naya password set karein.
7. Cart mein `WELCOME10` lagayein (PKR 2,000 se zyada ke items). Discount nazar aayega.
8. Doosre browser mein usi account se login karein. Cart wahi milega.
9. Admin **Inventory** mein kisi cart wale product ka stock 1 karein, phir cart kholein. "Only 1 left" aayega.
10. Customer se ek product **like** karein. Admin Inventory mein us ka stock **0** karke Save karein, phir **10** karein. Customer ko "Back in stock" email jayegi (Inbox, phir Sent emails mein dikhegi).
11. Contact Us mein topic **Complaint** chun kar message bhejein. Admin Inbox mein laal ⚠️ alert aayega, aur Customers page pe complaint "Yes" ho jayega.
12. Admin Orders mein order **delivered** karein. Customer ko email, aur Inbox mein 📦 alert.

## Masle
- **`Product "xyz" is not in the store database`:** `npm run seed:catalog` chalayein.
- **`Server se raabta nahi ho saka`:** Backend band hai.
- **Email `[mail] failed ... Invalid login`:** App Password galat hai, ya 2-Step Verification off hai.
- **`Invalid or expired token`:** Logout karke dobara login karein.
