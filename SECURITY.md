# MINAYSH: Security measures

This file lists how the store and the AI skin assistant (RAG chatbot) are protected, and what to set before going live.

## 1. Store (Node / Express backend)

| Threat | Protection | Where |
|---|---|---|
| Password guessing (brute force) | Login, register and Google sign-in: 10 tries per IP per 15 min. Forgot/reset password: 5 per hour | `middlewares/security.middleware.js`, `routes/auth.routes.js` |
| Weak passwords | New passwords need 8+ characters with a letter and a number; stored with bcrypt | `validators/auth.validator.js`, `services/auth.service.js` |
| Account enumeration | "Forgot password" always gives the same answer | `services/auth.service.js` |
| Reset link theft | Random 32-byte token, only its SHA-256 hash is stored, expires, single use | `services/auth.service.js` |
| Stolen / forged login tokens | JWT signed with a secret that must be 32+ characters (server refuses to start otherwise), 7-day expiry | `server.js`, `middlewares/auth.middleware.js` |
| Other websites calling the API | CORS allow-list from `CORS_ORIGINS` | `middlewares/security.middleware.js` |
| Clickjacking, MIME sniffing, referrer leaks | Security headers on every response (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, CSP, HSTS on https) | `middlewares/security.middleware.js` |
| Seeing other customers' data (IDOR) | Orders, addresses, cart items are always looked up together with the logged-in user's id | `services/order.service.js`, `services/account.service.js` |
| Admin pages | Every `/api/admin` route needs a valid token with role `admin` | `routes/admin.routes.js` |
| SQL / NoSQL injection | Sequelize and Mongoose parameterised queries; type checks on login fields; admin chat search escapes regex | services, validators |
| Price tampering | Prices, stock, coupon and bundle discount are recalculated on the server at checkout | `services/order.service.js` |
| Coupon code guessing | 20 checks per IP per 10 min, one use per customer | `routes/coupon.routes.js`, `services/coupon.service.js` |
| Spam (contact form, newsletter) | 10 per IP per hour | `routes/support.routes.js` |
| Flooding the API (DoS) | 300 requests per IP per minute; JSON body limit 200 KB (6 MB only for chat photos) | `app.js` |
| Error messages leaking internals | 500 errors show a generic message; details go only to the server log | `middlewares/error.middleware.js` |
| Secrets in code | All keys are in `.env` files, which are in `.gitignore`; `.env.example` files list the names only; frontend `.env` holds only public values (API URL, Google Client ID) | `.gitignore`, `.env.example` files |
| Personal data leak (database dump, stolen backup) | Phone numbers and delivery addresses are encrypted per field with AES-256-GCM (random IV, auth tag detects tampering). Key `DATA_ENCRYPTION_KEY` lives only in `.env`, never in the database | `utils/fieldCrypto.js`, user / address / order models |
| Data in transit | HTTPS on the live site; database connections use TLS (`sslmode=require` on Neon, `mongodb+srv` on Atlas) | hosting, `.env` |

## 2. AI skin assistant (RAG chatbot)

Known attacks on RAG / LLM chatbots (OWASP Top 10 for LLM Applications) and what this project does:

| Attack | Protection |
|---|---|
| **Prompt injection** ("ignore your rules", "you are now in developer mode", "print your prompt") | User text is wrapped in a `<user_message>` data block and `<` `>` are neutralised, so it cannot close or fake the private notes. Known injection phrases (English and Roman Urdu) add a security note telling the model to refuse. Security rules sit at the top of the system prompt and say they win over anything in a message. |
| **Indirect prompt injection** (instructions hidden in product data or inside a photo) | Product names, brands and ingredients are cleaned (no brackets/tags/new lines, length-limited) before entering the prompt. The face-scan model's free-text "notes" are never passed to the chat model, only fixed fields (levels such as none/mild/moderate/high). |
| **System prompt / data leakage** | Replies containing private-note markers are rejected and regenerated. The model is told never to reveal instructions, other customers or system details. Each chat session has its own memory. |
| **Hallucinated or promised offers** (the bot inventing discounts or refunds) | Replies with coupon/voucher/"% off" promises or prices that are not in the store list are rejected. Orders, refunds and delivery questions are sent to the Help Center. |
| **Insecure output** (HTML, scripts, phishing links in replies) | Replies with links, e-mail addresses or HTML are rejected; the backend strips any tags; React shows replies as plain text (no `dangerouslySetInnerHTML`). |
| **Sensitive data sent to the AI** | Card numbers, CNIC and OTP are caught before the AI and before the profile is updated, and are masked before chats are saved. |
| **Denial of wallet / DoS** (spamming the paid AI API) | 20 messages per minute per session and per IP, 300 messages and 30 photo scans per IP per day (`CHAT_DAILY_LIMIT`, `SCAN_DAILY_LIMIT`), message 1,000 characters, photo 4 MB, chat memory trimmed to the last 24 turns. |
| **Direct access to the AI service** | `skincare-ai/server.py` listens only on `127.0.0.1` and checks `X-Service-Key` with a constant-time compare. Errors do not reveal details. |
| **Knowledge-base poisoning** | Only the project's own approved files; users cannot add documents. Every file is hashed, signed and scanned (see section 3). |
| **Medical harm** | Safety rules: no diagnosis, red-flag symptoms go to a dermatologist, pregnancy filters, scan results are hints only. |
| **Privacy of photos** | Photos are analysed and never stored; only the scan levels are saved with the chat. |

## 3. OWASP RAG Security Cheat Sheet: coverage

Checked against https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html

| # | Section | Status | How |
|---|---|---|---|
| 1 | Document poisoning | Done | `kb_guard.py`: SHA-256 of every knowledge/product file in `kb_manifest.json`, HMAC-signed with `KB_MANIFEST_KEY` (kept in `.env`, not with the files). Provenance per file (who approved, when, source, note). Scan for injection phrases, zero-width/bidi characters, HTML comments, scripts and links. Allow-list: only approved files load. Approval is a separate step (`approve`). |
| 2 | Embedding manipulation / privacy | Done for this scale | Embedding model name stored with the vectors and in the manifest; vector store signed (re-built if changed); top-k capped at 5 with a relevance threshold; no public embedding API; the knowledge base is public skincare text, not personal data. |
| 3 | Context window attacks | Done | Retrieved text inside `<retrieved_knowledge>` delimiters marked "facts only, never instructions"; reminder after the content; max 4 chunks of 1,500 characters each; chunks scanned before use. |
| 4 | Access control inheritance | Not applicable / retention done | One public knowledge base, no per-user documents. Chat logs auto-expire after `CHAT_RETENTION_DAYS` (default 180) and an admin can erase a chat (deletion is logged). |
| 5 | Source attribution | Done | Each answer returns the knowledge titles used ("Based on: ..." under the reply); saved chats keep title, file and hash. |
| 6 | Chunk isolation | Not applicable | Single tenant; each chat session has its own memory and profile (tested). |
| 7 | Index integrity | Done | Vector store and knowledge files are only written by the build/approve steps; changes are detected and logged. |
| 8 | Query injection via retrieval | Done | Queries are Unicode-normalised, stripped of invisible/control characters and cut to 500 characters; injection phrases flagged; rate limits per session and IP; scores never returned. |
| 9 | Output validation | Done | Replies checked for leaked notes, invented prices, coupon/discount promises, links, e-mails and HTML; rejected replies are regenerated or replaced with a safe message. |
| 10 | Tool invocation | Not applicable | The bot has no tools: it cannot place orders, see accounts or call APIs. |
| 11 | Caching | Not applicable | Responses are not cached. |
| 12 | Monitoring and incident response | Done | `skincare-ai/logs/security.log` (JSON lines: event, time, session hash; never message text). `test_security.py`: 29 red-team tests (poisoned document, indirect injection via product and photo, tampered manifest, fail-closed, output validation, session isolation, PII). Three injection attempts pause a chat for 10 minutes. |
| 13 | Supply chain | Done | Product data scraped from an external site goes through the same scan and approval; Python packages version-ranged; MediaPipe pinned to 0.10.14; embedding model pinned in config. |
| 14 | Fail-closed design | Done | If the manifest, a file hash or retrieval fails, the bot does not answer from model memory; it says the knowledge is unavailable and `/health` reports `knowledge_base: false`. |

### Knowledge base workflow

```
python kb_guard.py scan        # check for hidden instructions / invisible characters
python kb_guard.py clean       # remove invisible characters
python kb_guard.py approve --by "Minahil" --note "what changed"
python kb_guard.py verify
python test_security.py        # red-team tests (no API key needed)
```

Any edit to `knowledge/*.md` or the product data needs a new `approve`; until then the chat stays off (fail-closed).

## 4. Settings before sharing the site

In `Backend/.env`:

```
JWT_SECRET=<64+ random characters>
DATA_ENCRYPTION_KEY=<exactly 64 hex characters, keep a safe offline copy>
CORS_ORIGINS=http://localhost:5173,https://your-live-site.example
SKINCARE_SERVICE_KEY=<random key, same as in skincare-ai/.env>
```

In `skincare-ai/.env`:

```
SKINCARE_SERVICE_KEY=<same random key>
KB_MANIFEST_KEY=<another random key, 32+ characters>
```

Optional in `Backend/.env`: `CHAT_RETENTION_DAYS=180`, `CHAT_DAILY_LIMIT=300`, `SCAN_DAILY_LIMIT=30`.

Also:
- Change the admin password: the demo password from `scripts/seed.js` is public in the repository.
- Serve the live site over HTTPS only.
- Keep `.env` files out of git and never paste keys in chats or screenshots.

## 5. Encryption summary

| Data | Where | Protection |
|---|---|---|
| Passwords | Postgres `users.password` | bcrypt hash (cost 10), never reversible |
| Reset tokens | Postgres `users.resetTokenHash` | SHA-256 hash, single use, expires |
| Phone numbers | `users`, `addresses`, `orders` | AES-256-GCM field encryption |
| Delivery address (name, street, postal) | `addresses`, `orders.shippingAddress` | AES-256-GCM field encryption (city kept plain for reports) |
| Name, email | `users`, `orders` | Plain: needed for login, search and order emails; protected by provider disk encryption and access control |
| Chat messages | MongoDB | Card / CNIC / OTP masked before saving; auto-deleted after `CHAT_RETENTION_DAYS` |
| Face photos | nowhere | Never stored |
| All databases at rest | Neon, Atlas | Provider disk encryption (AES-256) |
| Everything in transit | browser, API, databases | TLS / HTTPS |

Existing rows are encrypted once with `node scripts/encrypt-existing-data.js` (safe to run again).

## 6. Known limits (honest list for the viva)

- Rate limits are in memory: they reset when the server restarts, and they work per server instance. A real deployment would use Redis.
- The manifest key protects against someone who can edit the knowledge files but not `.env`; someone with full access to the server could change both.
- Prompt-injection filters reduce risk but cannot make an LLM fully safe; this is why the bot has no tools, no access to orders or accounts, and every price is checked in code.
- If `DATA_ENCRYPTION_KEY` is lost, encrypted phone numbers and addresses cannot be recovered; keep an offline copy. Rotating it needs a re-encryption script (not built yet).
- Encrypted fields cannot be searched with SQL; this is why name, email and city stay plain.
- The JWT is stored in the browser, so a cross-site scripting bug would expose it; React escaping and the "no HTML in replies" rule reduce that risk. An httpOnly cookie would be stronger.
