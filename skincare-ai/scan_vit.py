"""Skin type ka local model (ViT): dima806/skin_types_image_detection (Hugging Face, Apache-2.0).
Classes: dry / normal / oily. Tasveer computer se bahar nahi jati.
Pehle install:  pip install torch transformers pillow
Test:           python scan_vit.py "C:\\path\\photo.jpg"
Pehli dafa model (~350 MB) download hota hai."""
import sys

MODEL = "dima806/skin_types_image_detection"
_pipe = None


def available():
    try:
        import torch, transformers, PIL  # noqa: F401
        return True
    except Exception:
        return False


def _load():
    global _pipe
    if _pipe is None:
        from transformers import pipeline
        _pipe = pipeline("image-classification", model=MODEL)
    return _pipe


def predict(path_or_image):
    """-> {"ok": True, "skin_type": "oily", "confidence": 0.71, "scores": {...}}  ya {"ok": False, "error": ...}"""
    try:
        from PIL import Image
        img = path_or_image if not isinstance(path_or_image, (str, bytes)) else None
        if img is None:
            if isinstance(path_or_image, bytes):
                import io
                img = Image.open(io.BytesIO(path_or_image))
            else:
                img = Image.open(path_or_image)
        out = _load()(img.convert("RGB"), top_k=3)
        scores = {str(o["label"]).lower(): round(float(o["score"]), 3) for o in out}
        best = max(scores, key=scores.get)
        return {"ok": True, "skin_type": best, "confidence": scores[best], "scores": scores}
    except Exception as e:
        return {"ok": False, "error": str(e)[:200]}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Use: python scan_vit.py "tasveer ka path"'); sys.exit(1)
    print(predict(sys.argv[1]))
