"""Security events ka log (OWASP RAG cheat sheet section 12).
Sirf event ki qisam, waqt, session ka hash aur ids likhte hain; user ka message, prompt ya jawab KABHI nahi.
File: logs/security.log (JSON lines), aur console par bhi."""
import datetime, hashlib, json, threading
from pathlib import Path

LOG = Path(__file__).parent / "logs" / "security.log"
_lock = threading.Lock()


def sid_hash(session_id):
    return hashlib.sha256(str(session_id or "").encode()).hexdigest()[:12] if session_id else None


def event(kind, **fields):
    rec = {"t": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"), "event": kind, **fields}
    line = json.dumps(rec, ensure_ascii=False, default=str)
    print("[SECURITY]", line)
    try:
        with _lock:
            LOG.parent.mkdir(exist_ok=True)
            with LOG.open("a", encoding="utf-8") as f:
                f.write(line + "\n")
    except OSError:
        pass
