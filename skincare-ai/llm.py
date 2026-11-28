"""LLM providers (Gemini / Claude): llm.run(system, user_text, tools, run_tool) -> text.
tools khali ho to bina tools ke seedha jawab (context-first mode). Har provider apni history rakhta hai."""
import json, time, urllib.request, urllib.error
import config


def _post(url, headers, body, timeout=120, tries=5):
    data = json.dumps(body).encode()
    for attempt in range(tries):
        req = urllib.request.Request(url, data, {"content-type": "application/json", **headers})
        try:
            return json.load(urllib.request.urlopen(req, timeout=timeout))
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:400]
            if e.code in (429, 500, 503) and attempt < tries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            raise RuntimeError(f"API error {e.code}: {msg}")
        except (TimeoutError, urllib.error.URLError) as e:
            if attempt < tries - 1:
                time.sleep(2 * (attempt + 1))
                continue
            raise RuntimeError(f"Network/timeout error: {e}")


_SWITCH_CODES = ("API error 429", "API error 403", "RESOURCE_EXHAUSTED", "API_KEY_INVALID", "PERMISSION_DENIED")
_key_index = 0          # jo key aakhri dafa chali, agli call wahin se shuru


def gemini_post(urls, body, timeout=40, tries=2):
    """urls: models ke hisaab se URL list. Har model pe pehle chalti hui key, limit/ghalat key ho to agli key."""
    global _key_index
    keys = config.GEMINI_KEYS or ([config.GEMINI_KEY] if config.GEMINI_KEY else [])
    if not keys:
        raise RuntimeError("GEMINI_API_KEY set nahi hai")
    last = None
    for url in urls:
        for step in range(len(keys)):
            i = (_key_index + step) % len(keys)
            try:
                r = _post(url, {"x-goog-api-key": keys[i]}, body, timeout=timeout,
                          tries=1 if len(keys) > 1 else tries)
                if i != _key_index:
                    print(f"[gemini] key #{i + 1} par shift ho gaye")
                    _key_index = i
                return r
            except RuntimeError as e:
                last = e
                if not any(c in str(e) for c in _SWITCH_CODES):
                    break                      # model ka masla (503/timeout): agla model
    raise last


class ClaudeLLM:
    def __init__(self):
        self.history = []

    def run(self, system, user_text, tools, run_tool):
        self.history.append({"role": "user", "content": user_text})
        ctools = [{"name": t["name"], "description": t["description"], "input_schema": t["parameters"]} for t in tools]
        for _ in range(6):
            body = {"model": config.CLAUDE_MODEL, "max_tokens": 1024, "system": system, "messages": self.history}
            if ctools:
                body["tools"] = ctools
            r = _post("https://api.anthropic.com/v1/messages",
                      {"x-api-key": config.CLAUDE_KEY, "anthropic-version": "2023-06-01"}, body)
            self.history.append({"role": "assistant", "content": r["content"]})
            uses = [b for b in r["content"] if b["type"] == "tool_use"]
            if not uses:
                return "".join(b.get("text", "") for b in r["content"] if b["type"] == "text")
            self.history.append({"role": "user", "content": [
                {"type": "tool_result", "tool_use_id": u["id"], "content": json.dumps(run_tool(u["name"], u["input"]))} for u in uses]})
        return "Sorry, kuch masla aa gaya. Dobara try karein."


class GeminiLLM:
    URL = "https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"

    def __init__(self):
        self.history = []

    def _generate(self, body):
        # ek model busy ho to agla model; key ki limit khatam ho to agli key
        return gemini_post([self.URL.format(m=m) for m in config.GEMINI_MODELS], body, timeout=40)

    def run(self, system, user_text, tools, run_tool):
        self.history.append({"role": "user", "parts": [{"text": user_text}]})
        decl = [{"name": t["name"], "description": t["description"], "parameters": t["parameters"]} for t in tools]
        for _ in range(6):
            body = {"system_instruction": {"parts": [{"text": system}]}, "contents": self.history}
            if decl:
                body["tools"] = [{"function_declarations": decl}]
            r = self._generate(body)
            cands = r.get("candidates") or []
            if not cands or "content" not in cands[0]:
                self.history.pop()      # kharab turn history mein na rahe
                return "Maazrat, jawab nahi bana. Sawal dobara likhein."
            content = cands[0]["content"]
            content.setdefault("role", "model")
            self.history.append(content)
            parts = content.get("parts", [])
            calls = [p["functionCall"] for p in parts if "functionCall" in p]
            if not calls:
                return "".join(p.get("text", "") for p in parts)
            self.history.append({"role": "user", "parts": [
                {"functionResponse": {"name": c["name"], "response": {"result": run_tool(c["name"], c.get("args", {}))}}} for c in calls]})
        return "Sorry, kuch masla aa gaya. Dobara try karein."


def make_llm():
    if config.PROVIDER == "gemini" and config.GEMINI_KEY: return GeminiLLM()
    if config.PROVIDER == "claude" and config.CLAUDE_KEY: return ClaudeLLM()
    return None
