"""Scan module ki accuracy dataset par naapta hai (FYP report ke liye).
Folder ka dhancha: har label ka apna folder, andar tasveerein. Misal:
    scan-test/oily/*.jpg   scan-test/dry/*.jpg   scan-test/normal/*.jpg        -> --field skin_type
    scan-test/acne/*.jpg   scan-test/clear/*.jpg                                -> --field acne
Chalao:  python eval_scan.py "C:\\path\\scan-test" --field skin_type --per-class 15
Natija:  screen par accuracy + confusion table, aur eval_results.csv"""
import argparse, csv, random, time
from collections import Counter, defaultdict
from pathlib import Path
import scan

EXT = {".jpg", ".jpeg", ".png", ".webp"}


def predict(result, field):
    if not result.get("ok"):
        return "error"
    if not result.get("face_found") or result.get("image_quality") != "good":
        return "no_face/poor"
    if field == "skin_type":
        return result["skin_type_guess"]
    return "acne" if result["acne"] != "none" else "clear"          # field == acne


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--field", choices=["skin_type", "acne"], default="skin_type")
    ap.add_argument("--engine", choices=["gemini", "vit"], default="gemini", help="gemini = scan.py, vit = local ViT model (sirf skin_type)")
    ap.add_argument("--per-class", type=int, default=15, help="har label se kitni tasveerein (free API limit ka khayal)")
    ap.add_argument("--delay", type=float, default=4.0, help="do requests ke beech seconds")
    ap.add_argument("--seed", type=int, default=1)
    args = ap.parse_args()

    root, rng, rows = Path(args.folder), random.Random(args.seed), []
    labels = sorted(d.name.lower() for d in root.iterdir() if d.is_dir())
    if not labels:
        print("Is folder mein label ke folders nahi mile."); return
    for label in labels:
        files = sorted(f for f in (root / label).iterdir() if f.suffix.lower() in EXT)
        rng.shuffle(files)
        for f in files[: args.per_class]:
            if args.engine == "vit":
                import scan_vit
                res = scan_vit.predict(str(f))
                pred = res["skin_type"] if res.get("ok") else "error"
                res["notes"] = str(res.get("scores", ""))
            else:
                res = scan.analyze_file(f)
                pred = predict(res, args.field)
            rows.append({"file": f.name, "label": label, "predicted": pred, "detail": res.get("error") or res.get("notes", "")})
            print(f"{label:12} -> {pred:14} {f.name}")
            if args.engine == "gemini":
                time.sleep(args.delay)

    with open(f"eval_results_{args.engine}_{args.field}.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["file", "label", "predicted", "detail"]); w.writeheader(); w.writerows(rows)

    judged = [r for r in rows if r["predicted"] not in ("error", "no_face/poor")]
    correct = sum(r["label"] == r["predicted"] for r in judged)
    print(f"\nKul tasveerein: {len(rows)} | scan hui: {len(judged)} | error/no face: {len(rows) - len(judged)}")
    if judged:
        print(f"Accuracy: {correct}/{len(judged)} = {100 * correct / len(judged):.1f}%")
    conf = defaultdict(Counter)
    for r in rows:
        conf[r["label"]][r["predicted"]] += 1
    preds = sorted({r["predicted"] for r in rows})
    print("\nConfusion table (row = asli label, column = scan ka jawab)")
    print(f"{'':12}" + "".join(f"{p:>14}" for p in preds))
    for label in labels:
        print(f"{label:12}" + "".join(f"{conf[label][p]:>14}" for p in preds))
    print(f"\nTafseel: eval_results_{args.engine}_{args.field}.csv")


if __name__ == "__main__":
    main()
