"""Face scan module (optional tool): selfie -> skin ke nazar aane wale ishare (visual hint, diagnosis NAHI).
Gemini vision use hota hai. Tasveer kahin save nahi hoti. Alag test:  python scan_cli.py photo.jpg"""
import base64, json, mimetypes
from pathlib import Path
import config
from llm import _post

URL = "https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
MAX_BYTES = 4 * 1024 * 1024
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
LEVELS = ["none", "mild", "moderate", "high"]
SKIN_TYPES = ["oily", "dry", "combination", "normal", "unknown"]
QUALITY_ISSUES = ["none", "too_dark", "too_bright", "uneven_light", "blurry", "face_turned", "face_too_small", "multiple_faces", "face_covered", "filter_or_makeup", "no_face"]
FIELDS = ["oiliness", "acne", "dryness", "redness", "dark_spots", "dark_circles"]

PROMPT = """You are a cosmetic skin-surface checker for a skincare shop. Look ONLY at the visible facial skin in this photo.
Return ONLY a JSON object with exactly these keys:
{"face_found": true/false,
 "image_quality": "good" | "poor",
 "quality_issues": [zero or more of "too_dark", "too_bright", "uneven_light", "blurry", "face_turned", "face_too_small", "multiple_faces", "face_covered", "filter_or_makeup", "no_face"],
 "skin_type_guess": "oily" | "dry" | "combination" | "normal" | "unknown",
 "oiliness": "none" | "mild" | "moderate" | "high",
 "acne": "none" | "mild" | "moderate" | "high",
 "dryness": "none" | "mild" | "moderate" | "high",
 "redness": "none" | "mild" | "moderate" | "high",
 "dark_spots": "none" | "mild" | "moderate" | "high",
 "dark_circles": "none" | "mild" | "moderate" | "high",
 "needs_dermatologist": true/false,
 "notes": "one short neutral sentence about what is visible"}
Rules:
- This is a cosmetic estimate, not medical. Never name a disease or diagnosis.
- needs_dermatologist is true only for something that clearly looks serious: an open wound, heavy inflamed cystic acne, or a single spot that is clearly darker than the others, raised, with an irregular border or uneven colour.
- If there is no clear human face, or it is too dark/blurry/heavily filtered or covered with makeup, set face_found or image_quality accordingly and use "unknown"/"none".
- quality_issues: EVERY problem that makes the skin hard to read, most important first (empty list when image_quality is good). face_turned = face tilted or turned to the side, or looking up/down. face_too_small = the face fills only a small part of the photo. multiple_faces = more than one person in the photo (set image_quality to "poor").
- Say nothing about who the person is, their age, gender, ethnicity, attractiveness or emotions."""


def _clean(raw):
    """Model ka jawab -> saaf, mehdood dict (ghalat values theek kar deta hai)."""
    out = {"ok": True, "face_found": bool(raw.get("face_found")),
           "image_quality": raw.get("image_quality") if raw.get("image_quality") in ("good", "poor") else "poor",
           "skin_type_guess": raw.get("skin_type_guess") if raw.get("skin_type_guess") in SKIN_TYPES else "unknown",
           "needs_dermatologist": bool(raw.get("needs_dermatologist")),
           "quality_issues": [q for q in (raw.get("quality_issues") or [raw.get("quality_issue")]) if q in QUALITY_ISSUES and q != "none"][:4],
           "notes": str(raw.get("notes") or "")[:200]}
    for f in FIELDS:
        v = str(raw.get(f) or "none").lower()
        out[f] = v if v in LEVELS else "none"
    if not out["face_found"]:
        out.update({f: "none" for f in FIELDS}, skin_type_guess="unknown")
    return out


def analyze_bytes(data, mime="image/jpeg", _call=None):
    """data: tasveer ke bytes. Return: dict (ok False ho to 'error' mein wajah)."""
    if mime not in ALLOWED_MIME:
        return {"ok": False, "error": "Sirf JPG, PNG ya WEBP tasveer chalti hai."}
    if not data or len(data) > MAX_BYTES:
        return {"ok": False, "error": "Tasveer khali hai ya 4 MB se bari hai."}
    if not config.GEMINI_KEY and _call is None:
        return {"ok": False, "error": "Scan ke liye GEMINI_API_KEY chahiye (.env)."}
    body = {"contents": [{"role": "user", "parts": [
                {"text": PROMPT}, {"inline_data": {"mime_type": mime, "data": base64.b64encode(data).decode()}}]}],
            "generationConfig": {"temperature": 0, "responseMimeType": "application/json"}}
    call = _call or _generate
    try:
        r = call(body)
        text = "".join(p.get("text", "") for p in r["candidates"][0]["content"]["parts"])
        raw = json.loads(text[text.index("{"): text.rindex("}") + 1])
    except Exception as e:                       # network / blocked / kharab JSON
        return {"ok": False, "error": f"Scan nahi ho saka: {str(e)[:120]}"}
    return _clean(raw)


def _generate(body):
    last = None
    for m in config.GEMINI_VISION_MODELS:
        try:
            return _post(URL.format(m=m), {"x-goog-api-key": config.GEMINI_KEY}, body, timeout=60, tries=2)
        except RuntimeError as e:
            last = e
    raise last


def analyze_file(path):
    p = Path(path)
    if not p.exists():
        return {"ok": False, "error": f"File nahi mili: {path}"}
    mime = mimetypes.guess_type(p.name)[0] or "image/jpeg"
    return analyze_bytes(p.read_bytes(), mime)


def to_profile(scan):
    """Scan -> chatbot ke profile ishare (skin_type, concerns). Sirf wazeh cheezein."""
    if not scan or not scan.get("ok") or not scan.get("face_found") or scan.get("image_quality") != "good":
        return None, []
    strong = lambda f: scan.get(f) in ("moderate", "high")
    some = lambda f: scan.get(f) in ("mild", "moderate", "high")
    concerns = []
    if some("acne"): concerns.append("acne")
    if some("dark_spots"): concerns.append("spots")
    if strong("dark_circles"): concerns.append("dark_circles")
    if strong("dryness"): concerns.append("dehydrated")
    # Skin type tasveer se bharosemand nahi (dataset test: ViT ~55%, Gemini ~36%), is liye profile mein
    # khud set NAHI hota. Bot nazar aane wali cheez bata kar user se skin type tasdeeq karwata hai.
    return None, concerns
