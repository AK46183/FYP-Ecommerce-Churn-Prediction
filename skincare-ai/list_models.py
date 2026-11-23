import json, urllib.request, config
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models?pageSize=100",
                             headers={"x-goog-api-key": config.GEMINI_KEY})
for m in json.load(urllib.request.urlopen(req))["models"]:
    if "generateContent" in m.get("supportedGenerationMethods", []):
        print(m["name"])