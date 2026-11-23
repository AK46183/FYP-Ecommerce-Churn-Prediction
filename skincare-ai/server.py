"""Skincare AI ki HTTP service (Node backend isay call karta hai). Koi extra library nahi.
Chalao:  python server.py        (default port 8001)
  GET  /health
  POST /chat  {"session_id": "abc", "message": "...", "image_base64": "...(optional)", "image_mime": "image/jpeg"}
       ->     {"reply": "...", "scan": {...} | null, "profile": {...}, "products": [{sku, name, brand, price, type}]}
  POST /reset {"session_id": "abc"}
.env:  SKINCARE_PORT=8001   SKINCARE_SERVICE_KEY=koi-lambi-random-string (Node bhi yehi X-Service-Key header mein bheje)"""
import base64, hmac, json, os, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import config
import scan
from assistant import Assistant
from rag import KnowledgeBaseError, get_retriever
import seclog

# Laptop par: 127.0.0.1 (sirf isi computer se). Render par: SKINCARE_HOST=0.0.0.0 aur PORT Render deta hai.
PORT = int(os.environ.get("PORT") or os.environ.get("SKINCARE_PORT", "8001"))
HOST = os.environ.get("SKINCARE_HOST", "127.0.0.1")
SERVICE_KEY = os.environ.get("SKINCARE_SERVICE_KEY") or None
MAX_BODY = 6 * 1024 * 1024          # base64 tasveer samet
SESSION_TTL, MAX_SESSIONS, MAX_MESSAGE = 60 * 60, 300, 1000

_sessions, _lock = {}, threading.Lock()      # session_id -> {"bot": Assistant, "t": last used, "lock": Lock}


def get_session(sid):
    now = time.time()
    with _lock:
        for k in [k for k, v in _sessions.items() if now - v["t"] > SESSION_TTL]:
            del _sessions[k]
        if sid not in _sessions:
            if len(_sessions) >= MAX_SESSIONS:
                del _sessions[min(_sessions, key=lambda k: _sessions[k]["t"])]
            bot = Assistant()
            bot.session_hash = seclog.sid_hash(sid)
            _sessions[sid] = {"bot": bot, "t": now, "lock": threading.Lock()}
        _sessions[sid]["t"] = now
        return _sessions[sid]


def handle_chat(data):
    if not isinstance(data, dict):
        return 400, {"error": "JSON object chahiye"}
    sid = str(data.get("session_id") or "").strip()[:80]
    message = str(data.get("message") or "").strip()[:MAX_MESSAGE]
    image = data.get("image_base64")
    if not sid:
        return 400, {"error": "session_id chahiye"}
    if not message and not image:
        return 400, {"error": "message ya image chahiye"}
    try:
        sess = get_session(sid)
    except KnowledgeBaseError:
        return 503, {"error": "Knowledge base unavailable (integrity check failed)"}
    with sess["lock"]:                         # ek session mein ek waqt mein ek hi message
        bot, result = sess["bot"], None
        if image:
            try:
                raw = base64.b64decode(str(image).split(",")[-1], validate=True)
            except Exception:
                return 400, {"error": "image_base64 theek nahi"}
            result = scan.analyze_bytes(raw, str(data.get("image_mime") or "image/jpeg"))
            if not message:
                message = "Maine skin scan ke liye selfie upload ki hai." if bot.lang == "ur" else "I uploaded a selfie for a skin scan."
        reply = bot.chat(message, scan=result)
        profile = {k: bot.state[k] for k in ("skin_type", "concerns", "allergies", "pregnancy")}
        products = list(getattr(bot, "last_products", []))
        sources = list(getattr(bot, "last_sources", []))
    return 200, {"reply": reply, "scan": result, "profile": profile, "products": products, "sources": sources}


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _authorized(self):
        if SERVICE_KEY is None:
            return True
        given = self.headers.get("X-Service-Key") or ""
        return hmac.compare_digest(given.encode(), SERVICE_KEY.encode())   # timing attack se bachao

    def do_GET(self):
        if self.path == "/health":
            try:
                get_retriever()._recheck()
                kb = True
            except Exception:
                kb = False
            return self._send(200 if kb else 503, {"ok": kb, "llm": bool(config.GEMINI_KEY or config.CLAUDE_KEY), "knowledge_base": kb})
        self._send(404, {"error": "not found"})

    def do_POST(self):
        if not self._authorized():
            return self._send(401, {"error": "unauthorized"})
        try:
            n = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            return self._send(400, {"error": "Content-Length theek nahi"})
        if n <= 0 or n > MAX_BODY:
            return self._send(413, {"error": "body khali hai ya bohat bari"})
        try:
            data = json.loads(self.rfile.read(n).decode("utf-8"))
        except Exception:
            return self._send(400, {"error": "JSON theek nahi"})
        try:
            if self.path == "/chat":
                return self._send(*handle_chat(data))
            if self.path == "/reset":
                with _lock:
                    _sessions.pop(str(data.get("session_id") or ""), None)
                return self._send(200, {"ok": True})
        except Exception as e:
            print("ERROR", self.path, type(e).__name__, str(e)[:300])        # detail sirf server ke log mein
            return self._send(500, {"error": "Service mein masla aa gaya"})
        self._send(404, {"error": "not found"})

    def log_message(self, fmt, *args):          # message ka matn log nahi karte (privacy)
        print(f"{self.command} {self.path} -> {args[1] if len(args) > 1 else ''}")


if __name__ == "__main__":
    try:
        get_retriever()
        print("Knowledge base verified.")
    except KnowledgeBaseError as e:
        print("KNOWLEDGE BASE CHECK FAILED -> chat band rahegi (fail-closed):", e)
        print("Review karke chalayein: python kb_guard.py scan  aur  python kb_guard.py approve --by \"<naam>\"")
    if not SERVICE_KEY:
        print("WARNING: SKINCARE_SERVICE_KEY set nahi. .env mein ek lambi random key rakhein (Backend/.env mein bhi wohi).")
    if HOST != "127.0.0.1" and not SERVICE_KEY:
        raise SystemExit("SKINCARE_HOST public hai lekin SKINCARE_SERVICE_KEY nahi: service band (koi bhi isay call kar sakta).")
    print(f"Skincare AI service: http://{HOST}:{PORT}  (LLM: {'on' if (config.GEMINI_KEY or config.CLAUDE_KEY) else 'OFFLINE'}, key check: {'on' if SERVICE_KEY else 'off'})")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
