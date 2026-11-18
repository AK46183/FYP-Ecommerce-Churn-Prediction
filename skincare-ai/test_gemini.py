import json, time, urllib.request, urllib.error, config

def call(model, body, timeout=30):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    req = urllib.request.Request(url, json.dumps(body).encode(),
        {"content-type": "application/json", "x-goog-api-key": config.GEMINI_KEY})
    t = time.time()
    try:
        r = urllib.request.urlopen(req, timeout=timeout)
        txt = json.load(r)["candidates"][0]["content"]["parts"][0].get("text", "")[:60]
        return f"OK {time.time()-t:.1f}s -> {txt!r}"
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code} {time.time()-t:.1f}s {e.read().decode()[:120]}"
    except Exception as e:
        return f"FAIL {time.time()-t:.1f}s {type(e).__name__}"

simple = {"contents": [{"role": "user", "parts": [{"text": "Say hi in one word"}]}]}
for m in ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite", "gemini-flash-lite-latest", "gemma-4-26b-a4b-it"]:
    print(m, "->", call(m, simple))