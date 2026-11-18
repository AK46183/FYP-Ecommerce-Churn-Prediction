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
        last = None
        for m in config.GEMINI_MODELS:          # ek model busy ho to agla try
            try:
                return _post(self.URL.format(m=m), {"x-goog-api-key": config.GEMINI_KEY}, body, timeout=40, tries=2)
            except RuntimeError as e:
                last = e
        raise last

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
