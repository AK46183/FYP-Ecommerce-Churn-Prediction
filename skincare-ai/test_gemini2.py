import json, time, urllib.request, urllib.error, config
from assistant import SYSTEM, TOOLS

def call(model, body, timeout=40):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    req = urllib.request.Request(url, json.dumps(body).encode(),
        {"content-type": "application/json", "x-goog-api-key": config.GEMINI_KEY})
    t = time.time()
    try:
        r = json.load(urllib.request.urlopen(req, timeout=timeout))
        parts = r["candidates"][0]["content"]["parts"]
        what = [("CALL " + p["functionCall"]["name"]) if "functionCall" in p else p.get("text", "")[:50] for p in parts]
        return f"OK {time.time()-t:.1f}s {what}"
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code} {time.time()-t:.1f}s {e.read().decode()[:150]}"
    except Exception as e:
        return f"FAIL {time.time()-t:.1f}s {type(e).__name__}"

q = {"role": "user", "parts": [{"text": "meri skin oily hai aur pimples hain, kya use karun?"}]}
decl = [{"name": t["name"], "description": t["description"], "parameters": t["parameters"]} for t in TOOLS]
sysi = {"parts": [{"text": SYSTEM}]}
tests = {
  "A sirf sawal": {"contents": [q]},
  "B sawal + system": {"contents": [q], "system_instruction": sysi},
  "C sawal + tools": {"contents": [q], "tools": [{"function_declarations": decl}]},
  "D sab kuch (asli)": {"contents": [q], "system_instruction": sysi, "tools": [{"function_declarations": decl}]},
}
for m in ["gemini-3.5-flash-lite", "gemini-flash-lite-latest"]:
    for name, body in tests.items():
        print(m, "|", name, "->", call(m, body))