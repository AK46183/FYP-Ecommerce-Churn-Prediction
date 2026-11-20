"""Knowledge base ki hifazat (OWASP RAG Security Cheat Sheet: sections 1, 7, 13, 14).

Kya karta hai:
  1) SCAN: knowledge/*.md aur product data mein chhupi hidayat (prompt injection), invisible / zero-width
     characters, HTML comments, scripts, links dhoondta hai.
  2) MANIFEST: har approved file ka SHA-256 + kis ne, kab, kyun approve kiya (provenance) -> kb_manifest.json
     Manifest par HMAC signature lagta hai (key: KB_MANIFEST_KEY, .env mein; knowledge files ke saath nahi).
  3) VERIFY: service shuru hone par har file ka hash manifest se milata hai. Koi file badli, nayi aayi
     ya signature ghalat -> service jawab nahi deti (fail-closed) aur alert likhti hai.

Istemal:
  python kb_guard.py scan                       # sirf check
  python kb_guard.py clean                      # invisible characters hatao
  python kb_guard.py approve --by "Afifa" --note "lifestyle.md mein wedding tips"
  python kb_guard.py verify
"""
import argparse, datetime, hashlib, hmac, json, os, re, sys, unicodedata
from pathlib import Path

import config  # .env load karta hai

ROOT = Path(__file__).parent
MANIFEST = ROOT / "kb_manifest.json"
KB_DIR = ROOT / "knowledge"
DATA_FILES = [ROOT / "data" / "catalog.json", ROOT / "data" / "skincare_data.json"]


def manifest_key():
    k = os.environ.get("KB_MANIFEST_KEY") or ""
    return k.encode() if len(k) >= 32 else None


def tracked_files():
    """Allow-list: sirf yeh files RAG mein ja sakti hain."""
    files = sorted(KB_DIR.glob("*.md")) + [f for f in DATA_FILES if f.exists()]
    return [f for f in files if f.is_file()]


def sha256(path):
    """Text files ka hash line endings (CRLF/LF) se azad, taake Windows / git ki wajah se ghalat alarm na ho."""
    data = path.read_bytes()
    if path.suffix in (".md", ".json", ".txt"):
        data = data.replace(b"\r\n", b"\n")
    return hashlib.sha256(data).hexdigest()


# ------------------------------------------------------------------ scan

INVISIBLE = re.compile("[​-‏‪-‮⁠-⁤⁦-⁩﻿­\U000e0000-\U000e007f]")
INJECTION_MARKERS = re.compile(
    r"ignore\s+(all\s+|any\s+|the\s+|previous\s+|above\s+|prior\s+)*(rules|instructions|prompt)"
    r"|disregard\s+(the\s+)?(above|previous|system)|system\s*prompt|you\s+are\s+now|new\s+instructions?"
    r"|developer\s*mode|jailbreak|act\s+as\s+(an?\s+)?(ai|assistant|admin)|do\s+not\s+tell\s+the\s+user"
    r"|\[\s*(system|assistant)\s*\]|</?\s*(system|private_notes|user_message|instructions?)\s*>"
    r"|reveal\s+(your|the)\s+(prompt|instructions|key)|api[_\s-]?key",
    re.I,
)
HIDDEN_MARKUP = re.compile(r"<!--.*?-->|<\s*script|javascript:|data:text/html", re.I | re.S)
LINK = re.compile(r"https?://|www\.", re.I)


def scan_text(text, where=""):
    """Ek matn ke masle: [(kind, detail)]"""
    issues = []
    if INVISIBLE.search(text):
        issues.append(("invisible_chars", f"{where}: invisible/zero-width/bidi characters"))
    if any(unicodedata.category(ch) == "Cc" and ch not in "\n\r\t" for ch in text):
        issues.append(("control_chars", f"{where}: control characters"))
    m = INJECTION_MARKERS.search(text)
    if m:
        issues.append(("injection", f"{where}: '{m.group(0)[:60]}'"))
    if HIDDEN_MARKUP.search(text):
        issues.append(("hidden_markup", f"{where}: HTML comment / script"))
    if LINK.search(text):
        issues.append(("link", f"{where}: link inside knowledge"))
    return issues


def scan_file(path):
    issues = []
    raw = path.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return [("encoding", f"{path.name}: not UTF-8 text")]
    if path.suffix == ".md":
        for i, line in enumerate(text.splitlines(), 1):
            issues += scan_text(line, f"{path.name}:{i}")
    elif path.suffix == ".json":
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            return [("json", f"{path.name}: invalid JSON")]
        rows = data if isinstance(data, list) else data.get("products", []) if isinstance(data, dict) else []
        for r in rows:
            if not isinstance(r, dict):
                continue
            for field in ("name", "brand", "description", "key_ingredients", "ingredients", "subCategory"):
                v = r.get(field)
                if isinstance(v, list):
                    v = " ".join(map(str, v))
                if isinstance(v, str) and v:
                    for kind, detail in scan_text(v, f"{path.name} [{r.get('sku', '?')}].{field}"):
                        if kind != "link":            # product data mein link maana ja sakta hai
                            issues.append((kind, detail))
    return issues


def scan_all():
    issues = []
    for f in tracked_files():
        issues += scan_file(f)
    return issues


def clean_files():
    """Invisible / zero-width / control characters files se hata do (matn wahi rehta hai). Badli files ke naam lautata hai."""
    changed = []
    for f in tracked_files():
        text = f.read_text(encoding="utf-8")
        new = INVISIBLE.sub("", text)
        new = "".join(ch for ch in new if not (unicodedata.category(ch) == "Cc" and ch not in "\n\r\t"))
        if new != text:
            f.write_text(new, encoding="utf-8")
            changed.append(f.relative_to(ROOT).as_posix())
    return changed


# ------------------------------------------------------------------ manifest

def _canonical(entries):
    return json.dumps(entries, sort_keys=True, separators=(",", ":")).encode()


def _sign(entries):
    key = manifest_key()
    return hmac.new(key, _canonical(entries), hashlib.sha256).hexdigest() if key else None


def approve(by, note="", force=False):
    issues = scan_all()
    if issues and not force:
        print("Scan mein masle mile. Pehle theek karein (ya soch samajh kar --force):")
        for kind, detail in issues:
            print(f"  [{kind}] {detail}")
        return False
    old = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    old_files = old.get("entries", {}).get("files", {})
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
    files = {}
    for f in tracked_files():
        rel = f.relative_to(ROOT).as_posix()
        digest = sha256(f)
        prev = old_files.get(rel)
        same = prev and prev.get("sha256") == digest
        files[rel] = {
            "sha256": digest,
            "bytes": f.stat().st_size,
            "approved_by": prev["approved_by"] if same else by,
            "approved_at": prev["approved_at"] if same else now,
            "source": "project knowledge base" if rel.startswith("knowledge/") else "store catalog export",
            "note": prev.get("note", "") if same else note,
        }
    entries = {"version": 1, "embed_model": config.GEMINI_EMBED_MODEL, "files": files}
    out = {"entries": entries, "mac": _sign(entries), "signed": bool(manifest_key())}
    MANIFEST.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Approved {len(files)} files -> {MANIFEST.name}" + ("" if manifest_key() else "  (WARNING: KB_MANIFEST_KEY nahi, manifest signed nahi)"))
    return True


def verify():
    """(ok, problems)  -- fail-closed: koi bhi shak ho to ok=False"""
    problems = []
    if not MANIFEST.exists():
        return False, ["kb_manifest.json nahi mila. Chalayein: python kb_guard.py approve --by \"<naam>\""]
    try:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
        entries = data["entries"]
    except Exception:
        return False, ["kb_manifest.json kharab hai"]
    key = manifest_key()
    if key:
        if not data.get("mac") or not hmac.compare_digest(str(data.get("mac")), _sign(entries)):
            problems.append("manifest signature ghalat (kisi ne manifest badla ya KB_MANIFEST_KEY alag hai)")
    elif data.get("signed"):
        problems.append("manifest signed hai lekin KB_MANIFEST_KEY .env mein nahi")
    files = entries.get("files", {})
    current = {f.relative_to(ROOT).as_posix(): f for f in tracked_files()}
    for rel, meta in files.items():
        f = current.get(rel)
        if not f:
            problems.append(f"approved file gayab: {rel}")
        elif sha256(f) != meta.get("sha256"):
            problems.append(f"file badli hui (approve nahi hui): {rel}")
    for rel in current:
        if rel not in files:
            problems.append(f"nayi file approve nahi hui: {rel}")
    return not problems, problems


def digests():
    """Attribution ke liye: file -> sha256 (manifest se)"""
    try:
        return {k: v["sha256"] for k, v in json.loads(MANIFEST.read_text(encoding="utf-8"))["entries"]["files"].items()}
    except Exception:
        return {}


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Knowledge base: scan / approve / verify")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("scan")
    a = sub.add_parser("approve")
    a.add_argument("--by", required=True, help="kis ne review kiya")
    a.add_argument("--note", default="", help="kya badla")
    a.add_argument("--force", action="store_true", help="scan ke masle hone par bhi (sirf jaan boojh kar)")
    sub.add_parser("verify")
    sub.add_parser("clean")
    args = ap.parse_args()
    if args.cmd == "clean":
        changed = clean_files()
        print("Saaf ki gayi files: " + ", ".join(changed) if changed else "Kuch saaf karne ko nahi mila.")
        sys.exit(0)
    if args.cmd == "scan":
        found = scan_all()
        for kind, detail in found:
            print(f"[{kind}] {detail}")
        print("Scan saaf hai." if not found else f"{len(found)} masle mile.")
        sys.exit(1 if found else 0)
    if args.cmd == "approve":
        sys.exit(0 if approve(args.by, args.note, args.force) else 1)
    ok, probs = verify()
    print("Knowledge base verified." if ok else "VERIFY FAILED:\n  " + "\n  ".join(probs))
    sys.exit(0 if ok else 1)
