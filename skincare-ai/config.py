"""Settings .env se padhta hai (bina kisi extra library ke). Key kabhi code mein nahi likhni."""
import os
from pathlib import Path

def load_env():
    f = Path(__file__).parent / ".env"
    if f.exists():
        for line in f.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
load_env()

GEMINI_KEY = os.environ.get("GEMINI_API_KEY") or None
CLAUDE_KEY = os.environ.get("ANTHROPIC_API_KEY") or None
# LLM_PROVIDER=gemini | claude  (na ho to jis ki key mili wohi)
PROVIDER = os.environ.get("LLM_PROVIDER") or ("gemini" if GEMINI_KEY else "claude" if CLAUDE_KEY else None)
GEMINI_MODELS = [m.strip() for m in os.environ.get(
    "GEMINI_MODEL", "gemini-3.5-flash-lite,gemini-flash-lite-latest,gemini-3.1-flash-lite").split(",")]
GEMINI_EMBED_MODEL = os.environ.get("GEMINI_EMBED_MODEL", "gemini-embedding-001")
CLAUDE_MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5-5")
# scan (vision) ke liye models; na do to wohi chat wale
GEMINI_VISION_MODELS = [m.strip() for m in os.environ.get("GEMINI_VISION_MODEL", ",".join(GEMINI_MODELS)).split(",")]
