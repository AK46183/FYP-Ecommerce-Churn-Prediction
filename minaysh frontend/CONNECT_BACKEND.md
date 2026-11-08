# Frontend ↔ Backend connect

## Is zip mein kya hai
Sirf badli hui files hain. Inhein `minaysh frontend` folder mein extract karein, aur jab Windows puche to **Replace** chunein.

| File | Kya badla |
|---|---|
| `.env`, `.env.example` | `VITE_API_URL=http://localhost:5000/api` |
| `src/services/api.js` (nayi) | Backend call ka helper: token khud lagata hai, `data` nikal kar deta hai |
| `src/context/AuthContext.jsx` | Login aur register asli backend se |
| `src/pages/auth/Login.jsx`, `Register.jsx` | Backend se login/signup, aur galti ho to error message |
| `src/services/adminApi.js` | Dashboard, orders aur customers backend se |
| `src/services/churnApi.js` | Churn report, run scoring, send message, complaint aur engagement results |
| `src/services/saleApi.js`, `strategyApi.js` | Admin ke banaye events/strategies MongoDB mein. Ready-made wale frontend mein hi rehte hain |
| `src/pages/admin/AdminChurn.jsx` + `.css` | **Run scoring** button, card mein **Send message** aur **Mark complaint**, aur neeche **Engagement results** |
| `src/pages/admin/AdminOrders.jsx` | Asli orders, aur status dropdown se status badalna |
| `src/pages/admin/AdminCustomers.jsx` | Asli customers, churn risk aur complaint toggle |
| `src/pages/admin/AdminDashboard.jsx` | Data 0 ho to charts toot-te nahi |
| `src/pages/admin/AdminPages.css` | Tables ke naye styles |

## Har dafa chalane ka order (3 terminals)
1. **Python model** (`churn-service` folder mein):
   ```powershell
   & "..\.venv\Scripts\python.exe" -m uvicorn api.app:app --port 8000
   ```
2. **Backend** (`Backend` folder mein):
   ```powershell
   npm run dev
   ```
   Teeno lines aani chahiyen: PostgreSQL connected, MongoDB connected, Server running on port 5000.
3. **Frontend** (`minaysh frontend` folder mein):
   ```powershell
   npm run dev
   ```
   Browser mein `http://localhost:5173` kholein.

## Test
1. `/login` pe **Admin** tab chunein, phir `admin@minaysh.pk` / `Admin@123` se login karein. Aap `/admin` pe pohanch jayengi.
2. **Dashboard**: revenue, orders, customers aur churn ke asli numbers.
3. **Churn** page:
   - Orbit mein High aur Low risk customers.
   - Upar **Run scoring** dabayein. Neeche message aayega: "Scored 17 customers…".
   - Kisi High-risk customer pe click karein. Card mein **Send message now** aur **Mark complaint**.
   - Page ke neeche **Engagement results**: kitne messages gaye aur kis ne dobara order kiya.
4. **Orders**: dropdown se status badlein, page refresh karne pe bhi badla hua rahega.
5. **Customers**: har customer ka churn risk, aur complaint Yes/No.
6. Customer login: `zainab.tariq@example.com` / `Customer@123`. Naya account **Sign Up** se bhi bana sakti hain.

## Agar masla aaye
- **"Server se raabta nahi ho saka"**: Backend (`npm run dev`) band hai.
- **"Invalid or expired token"**: Logout karke dobara login karein.
- **Churn page pe "Churn service is not reachable"**: Python wala terminal band hai.
- **`.env` badli ho to:** Frontend ka `npm run dev` band karke dobara chalayein.
- **Purana demo login:** Pehle wala nakli login ab khud logout ho jata hai. Ab asli account se login karein.

## Abhi baqi (agla step)
Products, cart, checkout aur "My Orders" abhi bhi frontend ki apni product list aur browser storage pe hain. Is liye website se kiya gaya naya order abhi backend aur churn model tak nahi pohanchta. Churn abhi seed wale demo customers pe chalta hai.
