"""RAG: knowledge/*.md -> chunking -> embedding -> vector store -> search.
Embedding: Gemini key ho to asli embeddings (vector_store/ mein cache), warna TF-IDF (offline fallback)."""
import hashlib, hmac, json, re, unicodedata
from pathlib import Path
import numpy as np
import config
import kb_guard
import seclog

KB_DIR = Path(__file__).parent / "knowledge"
STORE = Path(__file__).parent / "vector_store"


MAX_CHUNK_CHARS = 1500          # ek chunk had se lamba na ho (context window attack)
MAX_QUERY_CHARS = 500


class KnowledgeBaseError(Exception):
    """Knowledge base verify na ho ya retrieval na chale: jawab na do (fail-closed)."""


def normalize_query(q):
    """Search se pehle: Unicode ek jaisa, invisible/control characters hatao, chhota karo."""
    q = unicodedata.normalize("NFKC", str(q or ""))
    q = kb_guard.INVISIBLE.sub("", q)
    q = "".join(ch for ch in q if unicodedata.category(ch)[0] != "C" or ch == " ")
    return re.sub(r"\s+", " ", q).strip()[:MAX_QUERY_CHARS]


def load_chunks():
    """Chunking: har '# heading' ek chunk. Shak wale chunk RAG mein nahi jate."""
    chunks = []
    for f in sorted(KB_DIR.glob("*.md")):
        for part in re.split(r"\n(?=# )", f.read_text(encoding="utf-8")):
            part = part.strip()
            if not part:
                continue
            title, _, body = part.partition("\n")
            chunk = {"source": f.name, "title": title.lstrip("# ").strip(), "text": body.strip()[:MAX_CHUNK_CHARS]}
            issues = kb_guard.scan_text(chunk["title"] + "\n" + chunk["text"], f"{f.name}#{chunk['title'][:40]}")
            if issues:
                seclog.event("kb_chunk_rejected", source=f.name, title=chunk["title"][:60], issues=[k for k, _ in issues])
                continue
            chunks.append(chunk)
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


VERIFY_EVERY = 60           # second: har itni der baad files dobara verify
_shared = None


def get_retriever():
    """Sab chats ek hi Retriever istemal karti hain (ek dafa verify + load)."""
    global _shared
    if _shared is None:
        _shared = Retriever()
    return _shared


class Retriever:
    def __init__(self):
        import time
        self._verified_at = time.time()
        ok, problems = kb_guard.verify()
        if not ok:
            seclog.event("kb_verify_failed", problems=problems)
            raise KnowledgeBaseError("Knowledge base verify nahi hua: " + "; ".join(problems))
        self.digests = kb_guard.digests()
        self.chunks = load_chunks()
        self.docs = [c["title"] + ". " + c["text"] for c in self.chunks]
        self.mode = "tfidf"
        if config.GEMINI_KEY:
            try:
                self.matrix = _norm(self._load_or_build())
                self.mode = "gemini"
            except Exception as e:
                print("[RAG] Gemini embeddings nahi chale, TF-IDF par ja raha hoon:", str(e)[:120])
        self._build_tfidf()
        if self.mode != "gemini":
            self.mode = "tfidf"

    def _build_tfidf(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)
        self.tfidf = self.vec.fit_transform([c["title"] + ". " + c["title"] + ". " + c["text"] for c in self.chunks])

    def _load_or_build(self):
        """Vector store: chunks badlein to hi dobara embed hota hai."""
        key = hashlib.sha256((config.GEMINI_EMBED_MODEL + "||".join(self.docs)).encode()).hexdigest()
        f = STORE / "embeddings.json"
        if f.exists():
            d = json.loads(f.read_text())
            if d.get("key") == key:
                if "mac" not in d:                     # purani file (signature se pehle ki): ek dafa sign kar do
                    d["mac"], d["model"] = self._mac(d["vectors"], key), config.GEMINI_EMBED_MODEL
                    f.write_text(json.dumps(d))
                    seclog.event("embeddings_signed", note="legacy store signed")
                    return np.array(d["vectors"], dtype="float32")
                if self._mac(d["vectors"], key) == d.get("mac"):
                    return np.array(d["vectors"], dtype="float32")
                seclog.event("embeddings_tampered", action="rebuilding")   # vectors badle gaye: dobara banao
        vecs = _gemini_embed(self.docs, "RETRIEVAL_DOCUMENT")
        STORE.mkdir(exist_ok=True)
        f.write_text(json.dumps({"key": key, "model": config.GEMINI_EMBED_MODEL, "vectors": vecs.tolist(),
                                 "mac": self._mac(vecs.tolist(), key)}))
        seclog.event("embeddings_built", model=config.GEMINI_EMBED_MODEL, chunks=len(self.docs))
        return vecs

    def _recheck(self):
        """Fail-closed: files baad mein badlein to retrieval band."""
        import time
        if time.time() - self._verified_at < VERIFY_EVERY:
            return
        ok, problems = kb_guard.verify()
        if not ok:
            seclog.event("kb_verify_failed", problems=problems)
            raise KnowledgeBaseError("knowledge base changed without approval")
        self._verified_at = time.time()

    @staticmethod
    def _mac(vectors, key):
        """Vector store ka signature (KB_MANIFEST_KEY se); key na ho to sirf hash."""
        body = (key + json.dumps(vectors, separators=(",", ":"))).encode()
        k = kb_guard.manifest_key()
        return hmac.new(k, body, hashlib.sha256).hexdigest() if k else hashlib.sha256(body).hexdigest()

    def search(self, query, k=3, min_score=None):
        """Top-k (max 5) chunks, relevance threshold ke saath. Scores user ko kabhi nahi jate."""
        self._recheck()
        query = normalize_query(query)
        k = max(1, min(int(k), 5))
        if not query:
            return []
        scores, floor = None, None
        if self.mode == "gemini":
            try:
                q = _norm(_gemini_embed([query], "RETRIEVAL_QUERY"))
                scores = (self.matrix @ q.T).ravel()
                floor = 0.45
            except Exception as e:                     # embedding API band: TF-IDF se retrieval (model memory se nahi)
                seclog.event("retrieval_fallback", reason=type(e).__name__)
        if scores is None:
            try:
                from sklearn.metrics.pairwise import cosine_similarity
                scores = cosine_similarity(self.vec.transform([query]), self.tfidf)[0]
                floor = 0.05
            except Exception as e:
                seclog.event("retrieval_failed", reason=type(e).__name__)
                raise KnowledgeBaseError("retrieval failed") from e
        min_score = floor if min_score is None else min_score
        order = scores.argsort()[::-1][:k]
        return [dict(self.chunks[i], score=float(scores[i])) for i in order if scores[i] >= min_score]
