"""MINAYSH skincare/sunscreen products dhoondta hai.
Pehle data/skincare_data.json (Makeup City se: ingredients, concerns, skin types, pregnancy flag) use hota hai;
na mile to data/catalog.json se naam-based tagging (UNVERIFIED)."""
import json, zlib
from pathlib import Path

DATA = Path(__file__).parent / "data"
SKIN_DATA, CATALOG = DATA / "skincare_data.json", DATA / "catalog.json"

KEYWORDS = {
    "salicylic": ["acne", "oily"], "bha": ["acne", "oily"], "acne": ["acne", "oily"], "niacinamide": ["oily", "pores", "spots"],
    "hyaluronic": ["dry", "dehydrated"], "ceramide": ["dry", "sensitive"], "vitamin c": ["spots", "dullness"],
    "arbutin": ["spots"], "bright": ["spots", "dullness"], "retinol": ["aging", "acne"], "oil control": ["oily"],
    "matte": ["oily"], "soothing": ["sensitive"], "aloe": ["sensitive", "dry"], "cica": ["sensitive", "acne"],
    "tea tree": ["acne"], "eye": ["dark_circles"], "centella": ["sensitive", "acne"],
}
TYPE_MAP = {"Face Wash": "cleanser", "Serums": "serum", "Sunscreen": "sunscreen", "Masks": "mask",
            "Eye Care": "eye_care", "Exfoliators": "exfoliator", "Day Cream": "moisturizer", "Night Cream": "moisturizer"}
# chatbot ke concern naam -> data ke concern naam
CONCERN_MAP = {"acne": "acne", "spots": "spots", "dullness": "spots", "dehydrated": "dryness", "dry": "dryness",
               "pores": "oil_control", "oily": "oil_control", "aging": "aging", "sensitive": "sensitive",
               "dark_circles": "dark_circles", "dark circles": "dark_circles"}


def _name_tags(p):
    name = (p["name"] + " " + (p.get("brand") or "")).lower()
    return sorted({t for k, v in KEYWORDS.items() if k in name for t in v})


PREG_RECHECK = ("retin", "salicylic", "glycolic", "kojic", "hydroquinone", "benzoyl", "mandelic", "lactic acid", "bha", "aha", "peel")


def _short_ingredients(text, n=6):
    """Sirf asli ingredient list (INCI) ke pehle n naam; marketing paragraph ho to None."""
    if not text:
        return None
    parts = [x.strip() for x in str(text).replace("\n", " ").split(",") if x.strip()]
    if len(parts) < 4 or any(len(x) > 45 for x in parts[:n]):
        return None
    return ", ".join(parts[:n])


def _preg_status(p, ing):
    """Data ka flag + dobara jaanch: koi bhi avoid-term naam ya ingredients mein ho to 'avoid'."""
    st = p.get("pregnancy", "unknown")
    hay = (p["name"] + " " + ing).lower()
    if st == "ok" and any(t in hay for t in PREG_RECHECK):
        return "avoid"
    return st


def load_products():
    items = []
    if SKIN_DATA.exists():
        for p in json.loads(SKIN_DATA.read_text(encoding="utf-8")):
            if not p.get("price") or not p.get("available", True):
                continue
            items.append({"sku": p["sku"], "name": p["name"], "brand": p.get("brand"), "price": p["price"],
                          "type": TYPE_MAP.get(p.get("subCategory"), "other"), "tags": p.get("concerns", []),
                          "skin_types": p.get("skin_types", ["all"]), "pregnancy": _preg_status(p, p.get("ingredients") or ""),
                          "ingredients": (p.get("ingredients") or "").lower(),
                          "key_ingredients": _short_ingredients(p.get("ingredients"))})
        return items
    for p in json.loads(CATALOG.read_text(encoding="utf-8")):
        if p["category"] not in ("skinCare", "sunCare") or not p.get("price") or not p.get("available", True):
            continue
        items.append({"sku": p["sku"], "name": p["name"], "brand": p.get("brand"), "price": p["price"],
                      "type": TYPE_MAP.get(p["subCategory"], "other"), "tags": _name_tags(p), "skin_types": ["all"],
                      "pregnancy": "unknown", "ingredients": "", "key_ingredients": None})
    return items


# naam mein asli active ho to us concern ke liye product ko oopar lao (description ke aam lafzon se zyada wazan)
NAME_ACTIVES = {
    "spots": ["vitamin c", "vit c", "niacinamide", "arbutin", "tranexamic", "kojic", "dark spot", "brightening", "glutathione", "licorice", "whitening"],
    "acne": ["salicylic", "bha", "tea tree", "acne", "niacinamide", "benzoyl", "blemish", "pimple"],
    "dryness": ["hyaluronic", "ceramide", "panthenol", "moistur", "hydrat", "squalane"],
    "oil_control": ["oil control", "niacinamide", "matte", "sebum", "pore"],
    "aging": ["retinol", "retinal", "peptide", "collagen", "anti aging", "anti-aging", "wrinkle"],
    "sensitive": ["centella", "cica", "soothing", "calming", "aloe", "panthenol"],
    "dark_circles": ["eye"],
}


def _safe(items):
    """Jis product ke naam/brand/ingredients mein chhupi hidayat ya invisible characters hon, woh RAG mein nahi jata."""
    import kb_guard, seclog
    out = []
    for p in items:
        text = " ".join(str(p.get(k) or "") for k in ("name", "brand", "key_ingredients"))
        issues = [k for k, _ in kb_guard.scan_text(text, p["sku"]) if k != "link"]
        if issues:
            seclog.event("product_rejected", sku=p["sku"], issues=issues)
            continue
        out.append(p)
    return out


class ProductSearch:
    def __init__(self):
        self.items = _safe(load_products())

    def still_ok(self, sku, exclude_terms=None, pregnant=False, allergies=None):
        """Pehle bataya hua product ab bhi theek hai? (allergy / pregnancy / exclude ke baad) -> product ya None"""
        p = next((x for x in self.items if x["sku"] == sku), None)
        if not p:
            return None
        name = (p["name"] + " " + (p["brand"] or "")).lower()
        if any(e.lower() in name for e in (exclude_terms or [])):
            return None
        if any(a.lower().strip() in name or a.lower().strip() in p["ingredients"] for a in (allergies or []) if a.strip()):
            return None
        if pregnant and p["pregnancy"] != "ok":
            return None
        return p

    def search(self, product_type=None, concerns=None, exclude_terms=None, limit=3,
               pregnant=False, skin_type=None, allergies=None, cheap=False, seed=None, avoid=None):
        want = {CONCERN_MAP.get(c.lower(), c.lower()) for c in (concerns or [])}
        exclude = [e.lower() for e in (exclude_terms or [])]       # naam par lagte hain
        allergies = [a.lower().strip() for a in (allergies or []) if a.strip()]   # naam + ingredients par
        out = []
        for p in self.items:
            if product_type and p["type"] != product_type:
                continue
            name = (p["name"] + " " + (p["brand"] or "")).lower()
            if any(e in name for e in exclude):
                continue
            if any(a in name or a in p["ingredients"] for a in allergies):
                continue
            if pregnant and p["pregnancy"] != "ok":      # pregnancy mein sirf wohi jin ki ingredients check hui aur theek lagin
                continue
            score = 2 * len(want & set(p["tags"])) + 3 * sum(any(a in name for a in NAME_ACTIVES.get(c, [])) for c in want)
            if skin_type and (skin_type in p["skin_types"]):
                score += 1
            if avoid and p["sku"] in avoid:              # user ne "koi aur batao" kaha: pehle dikhaye hue peeche
                score -= 6
            if p["ingredients"]:
                score += 0.5                                # jin ki ingredients maloom hain unhein pehle rakho
            out.append((score, p))
        if cheap:                                        # budget: jo match karte hain un mein se sab se saste pehle
            matched = [x for x in out if x[0] >= 2] or out
            matched.sort(key=lambda x: (bool(avoid and x[1]["sku"] in avoid), x[1]["price"]))
            return [dict(p, match_score=s) for s, p in matched[:limit]]
        out.sort(key=lambda x: -x[0])
        if seed is not None and out:                     # achhe matches ke pool (top 6) mein se har chat alag chunti hai
            best = out[0][0]
            pool = [x for x in out[: max(6, limit * 2)] if x[0] >= best * 0.5]
            pool.sort(key=lambda x: zlib.crc32(f"{seed}:{x[1]['sku']}".encode()))   # ek chat ke andar tarteeb wohi rehti hai
            out = pool + [x for x in out if x not in pool]
        return [dict(p, match_score=s) for s, p in out[:limit]]
