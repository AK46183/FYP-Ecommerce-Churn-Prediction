"""RAG: knowledge/*.md -> chunking -> embedding -> vector store -> search.
Embedding: Gemini key ho to asli embeddings (vector_store/ mein cache), warna TF-IDF (offline fallback)."""
import hashlib, json, re
from pathlib import Path
import numpy as np
import config

KB_DIR = Path(__file__).parent / "knowledge"
STORE = Path(__file__).parent / "vector_store"


def load_chunks():
    """Chunking: har '# heading' ek chunk."""
    chunks = []
    for f in sorted(KB_DIR.glob("*.md")):
        for part in re.split(r"\n(?=# )", f.read_text(encoding="utf-8")):
            part = part.strip()
            if not part:
                continue
            title, _, body = part.partition("\n")
            chunks.append({"source": f.name, "title": title.lstrip("# ").strip(), "text": body.strip()})
    return chunks


def _gemini_embed(texts, task):
    from llm import _post
    base = "https://generativelanguage.googleapis.com/v1beta/models/%s" % config.GEMINI_EMBED_MODEL
    out = []
    for i in range(0, len(texts), 50):                      # batch mein bhejo
        reqs = [{"model": "models/" + config.GEMINI_EMBED_MODEL, "content": {"parts": [{"text": t}]}, "taskType": task}
                for t in texts[i:i + 50]]
        r = _post(base + ":batchEmbedContents", {"x-goog-api-key": config.GEMINI_KEY}, {"requests": reqs})
        out += [e["values"] for e in r["embeddings"]]
    return np.array(out, dtype="float32")


def _norm(m):
    return m / (np.linalg.norm(m, axis=1, keepdims=True) + 1e-9)


class Retriever:
    def __init__(self):
        self.chunks = load_chunks()
        self.docs = [c["title"] + ". " + c["text"] for c in self.chunks]
        self.mode = "tfidf"
        if config.GEMINI_KEY:
            try:
                self.matrix = _norm(self._load_or_build())
                self.mode = "gemini"
            except Exception as e:
                print("[RAG] Gemini embeddings nahi chale, TF-IDF par ja raha hoon:", str(e)[:120])
        if self.mode == "tfidf":
            from sklearn.feature_extraction.text import TfidfVectorizer
            self.vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)
            self.matrix = self.vec.fit_transform([c["title"] + ". " + c["title"] + ". " + c["text"] for c in self.chunks])

    def _load_or_build(self):
        """Vector store: chunks badlein to hi dobara embed hota hai."""
        key = hashlib.sha256((config.GEMINI_EMBED_MODEL + "||".join(self.docs)).encode()).hexdigest()
        f = STORE / "embeddings.json"
        if f.exists():
            d = json.loads(f.read_text())
            if d.get("key") == key:
                return np.array(d["vectors"], dtype="float32")
        vecs = _gemini_embed(self.docs, "RETRIEVAL_DOCUMENT")
        STORE.mkdir(exist_ok=True)
        f.write_text(json.dumps({"key": key, "vectors": vecs.tolist()}))
        return vecs

    def search(self, query, k=3, min_score=None):
        if self.mode == "gemini":
            q = _norm(_gemini_embed([query], "RETRIEVAL_QUERY"))
            scores = (self.matrix @ q.T).ravel()
            min_score = 0.45 if min_score is None else min_score    # threshold test karke theek karna hai
        else:
            from sklearn.metrics.pairwise import cosine_similarity
            scores = cosine_similarity(self.vec.transform([query]), self.matrix)[0]
            min_score = 0.05 if min_score is None else min_score
        order = scores.argsort()[::-1][:k]
        return [dict(self.chunks[i], score=float(scores[i])) for i in order if scores[i] >= min_score]
