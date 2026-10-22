import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allProducts } from "../../data/products.js";
import { isPurchasable } from "../../services/product.js";
import { formatPKR } from "../../services/format.js";
import "./BeautyQuiz.css";

/* ------------------------------------------------------------------
   Where every product type lives on the site (all of these pages have products)
------------------------------------------------------------------- */
const TYPE_PAGES = {
  "Mascara": "/makeup/eye/mascara",
  "False Lashes": "/makeup/eye/lashes",
  "Eyeliner": "/makeup/eye/eyeliner",
  "Eyeshadow": "/makeup/eye/eyeshadow",
  "Eyeshadow Palettes": "/makeup/palettes/eyeshadow",
  "Brow Products": "/makeup/eye/brows",
  "Foundations": "/makeup/face/foundations",
  "Concealers": "/makeup/face/concealers",
  "Blush": "/makeup/face/blush",
  "Bronzers & Contours": "/makeup/face/bronzers-contours",
  "Face Highlighters": "/makeup/face/highlighters",
  "Face Primers": "/makeup/face/primers",
  "Face Powders": "/makeup/face/powders",
  "Makeup Fixers": "/makeup/face/fixers",
  "Lip Care": "/makeup/lip/care",
  "Lip Tints": "/makeup/lip/tints",
  "Lip Gloss": "/makeup/lip/gloss",
  "Lipstick": "/makeup/lip/lipstick",
  "Lip Liner": "/makeup/lip/liner",
};

// a "pick" = product type + words that make a product a better fit (optional)
const pick = (type, words = [], label) => ({ type, words, label: label || type });

const BUDGET = {
  id: "budget",
  question: "What would you like to spend?",
  options: [
    { value: "low", label: "Under Rs 1,500" },
    { value: "mid", label: "Rs 1,500 – 3,000" },
    { value: "high", label: "Rs 3,000 and above" },
    { value: "any", label: "Show me everything" },
  ],
};

/* ------------------------------------------------------------------
   Questions for each Beauty Inspiration page.
   Every answer leads to a product type the shop really has.
------------------------------------------------------------------- */
const FLOWS = {
  eye: [
    {
      id: "goal",
      question: "What do you want your eyes to do?",
      options: [
        { value: "lashes", label: "Bigger, fuller lashes" },
        { value: "liner", label: "A sharp, defined line" },
        { value: "colour", label: "Pops of colour" },
        { value: "brows", label: "Framed, neat brows" },
      ],
    },
    {
      id: "style",
      question: "Pick the look you like most",
      options: (a) => ({
        lashes: [
          { value: "natural", label: "Natural volume", result: pick("Mascara") },
          { value: "dramatic", label: "Dramatic, full-on lashes", result: pick("False Lashes") },
        ],
        liner: [
          { value: "soft", label: "Soft everyday line", result: pick("Eyeliner", ["pencil", "kajal", "kohl", "crayon", "gel"]) },
          { value: "wing", label: "Bold, sharp wing", result: pick("Eyeliner", ["liquid", "pen", "felt", "marker", "precision", "matic"]) },
        ],
        colour: [
          { value: "single", label: "One easy shade", result: pick("Eyeshadow") },
          { value: "palette", label: "A full palette to play with", result: pick("Eyeshadow Palettes") },
        ],
        brows: [
          { value: "fill", label: "Fill in & shape", result: pick("Brow Products", ["pencil", "powder", "pomade", "pen", "definer"]) },
          { value: "set", label: "Keep them in place", result: pick("Brow Products", ["gel", "fix", "soap", "mascara", "wax"]) },
        ],
      })[a.goal],
    },
    BUDGET,
  ],
  face: [
    {
      id: "goal",
      question: "What's your main goal?",
      options: [
        { value: "even", label: "Even out my skin" },
        { value: "cover", label: "Hide spots & dark circles" },
        { value: "glow", label: "Add colour & glow" },
        { value: "last", label: "Make my makeup last" },
      ],
    },
    {
      id: "style",
      question: "Which sounds more like you?",
      options: (a) => ({
        even: [
          { value: "light", label: "Light, skin-like coverage", result: pick("Foundations", ["tint", "bb", "cc", "dewy", "glow", "serum", "skin", "moist"], "Light foundations") },
          { value: "full", label: "Full, long-wear coverage", result: pick("Foundations", ["matte", "stay", "wear", "full", "24", "30", "fluid", "camouflage", "eraser"], "Full-coverage foundations") },
        ],
        cover: [
          { value: "light", label: "A little brightening", result: pick("Concealers", ["bright", "radiant", "glow", "light", "hydrat"]) },
          { value: "full", label: "Maximum coverage", result: pick("Concealers", ["full", "cover", "matte", "wear", "stay", "pro"]) },
        ],
        glow: [
          { value: "flush", label: "A rosy flush", result: pick("Blush") },
          { value: "sculpt", label: "Sculpt & warmth", result: pick("Bronzers & Contours") },
          { value: "shine", label: "Lit-from-within glow", result: pick("Face Highlighters") },
        ],
        last: [
          { value: "prime", label: "Smooth base before makeup", result: pick("Face Primers") },
          { value: "set", label: "Set & control shine", result: pick("Face Powders") },
          { value: "lock", label: "Lock everything in", result: pick("Makeup Fixers") },
        ],
      })[a.goal],
    },
    BUDGET,
  ],
  lip: [
    {
      id: "goal",
      question: "How do you like your lips?",
      options: [
        { value: "care", label: "Soft & cared for", result: pick("Lip Care") },
        { value: "tint", label: "A sheer wash of colour", result: pick("Lip Tints") },
        { value: "gloss", label: "Shiny & plump", result: pick("Lip Gloss") },
        { value: "rich", label: "Rich, full colour" },
      ],
    },
    {
      id: "style",
      question: "Which finish do you love?",
      skip: (a) => a.goal !== "rich",
      options: () => [
        { value: "matte", label: "Velvet matte", result: pick("Lipstick", ["matte", "velvet", "mattifying"]) },
        { value: "creamy", label: "Creamy & comfortable", result: pick("Lipstick", ["cream", "satin", "moist", "shine", "hydra", "nourish"]) },
        { value: "liner", label: "A defined outline first", result: pick("Lip Liner") },
      ],
    },
    BUDGET,
  ],
  looks: [
    {
      id: "goal",
      question: "What's the occasion?",
      options: [
        { value: "everyday", label: "Everyday / office" },
        { value: "night", label: "Date night / soft glam" },
        { value: "event", label: "Wedding or big event" },
        { value: "quick", label: "A 5-minute look" },
      ],
    },
    {
      id: "style",
      question: "Where do you want to start?",
      options: (a) => {
        const map = {
          everyday: { eyes: pick("Mascara"), lips: pick("Lip Tints"), face: pick("Foundations", ["tint", "bb", "cc", "dewy", "skin", "glow"], "Light foundations") },
          night: { eyes: pick("Eyeshadow Palettes"), lips: pick("Lipstick", ["matte", "velvet"]), face: pick("Face Highlighters") },
          event: { eyes: pick("False Lashes"), lips: pick("Lipstick"), face: pick("Makeup Fixers") },
          quick: { eyes: pick("Mascara"), lips: pick("Lip Gloss"), face: pick("Blush") },
        }[a.goal];
        return [
          { value: "eyes", label: "Eyes", result: map.eyes },
          { value: "lips", label: "Lips", result: map.lips },
          { value: "face", label: "Face", result: map.face },
        ];
      },
    },
    BUDGET,
  ],
};

const BUDGET_TEST = {
  low: (p) => p < 1500,
  mid: (p) => p >= 1500 && p <= 3000,
  high: (p) => p > 3000,
  any: () => true,
};

const textOf = (p) => `${p.name} ${p.tagline || ""} ${p.description || ""}`.toLowerCase();

// Real products for the answer: best fit first, never an empty list
function findProducts(result, budget) {
  let all = allProducts.filter((p) => p.subCategory === result.type && isPurchasable(p));
  if (!all.length) all = allProducts.filter((p) => p.subCategory === result.type);
  const test = BUDGET_TEST[budget || "any"];
  const fit = result.words.length ? all.filter((p) => result.words.some((w) => textOf(p).includes(w))) : [];
  // best fit in budget -> any of this type in budget -> best fit -> any of this type
  let list = fit.filter((p) => test(p.price));
  if (!list.length) list = all.filter((p) => test(p.price));
  if (!list.length) list = fit.length ? fit : all;
  list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
  return list.slice(0, 3);
}

// only offer budgets that really have products for this answer
function hasInBudget(result, budget) {
  return allProducts.some((p) => p.subCategory === result.type && isPurchasable(p) && BUDGET_TEST[budget](p.price));
}

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------- */
export default function BeautyQuiz({ category = "eye" }) {
  const navigate = useNavigate();
  const flow = FLOWS[category] || FLOWS.eye;
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]);

  // questions that apply to the answers given so far
  const steps = flow.filter((q) => !(q.skip && q.skip(answers)));
  const current = steps.find((q) => !(q.id in answers));
  const done = !current;
  const chosen = useMemo(() => {
    let r = null;
    for (const q of flow) {
      if (!(q.id in answers) || !q.options) continue;
      const opts = typeof q.options === "function" ? q.options(answers) : q.options;
      const o = (opts || []).find((x) => x.value === answers[q.id]);
      if (o && o.result) r = o.result;
    }
    return r;
  }, [answers, flow]);
  const optionsOf = (q) => {
    const opts = typeof q.options === "function" ? q.options(answers) : q.options;
    if (q.id !== "budget" || !chosen) return opts;
    return opts.filter((o) => o.value === "any" || hasInBudget(chosen, o.value));
  };
  const picks = done && chosen ? findProducts(chosen, answers.budget) : [];
  const link = chosen ? TYPE_PAGES[chosen.type] : "/";

  function choose(value) {
    setHistory((h) => [...h, current.id]);
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }
  function back() {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[last];
      return next;
    });
  }
  function restart() {
    setAnswers({});
    setHistory([]);
  }

  const total = steps.length;
  const position = Math.min(history.length, total);

  return (
    <div className="bq-card">
      <div className="bq-header">
        <h3 className="bq-title">Find your match</h3>
        {!done && (
          <span className="bq-count">
            {position + 1} / {total}
          </span>
        )}
      </div>

      <div className="bq-progress">
        <div className="bq-progress-bar" style={{ width: `${(position / total) * 100}%` }} />
      </div>

      {!done ? (
        <div className="bq-body" key={current.id}>
          <p className="bq-question">{current.question}</p>
          <div className="bq-options">
            {optionsOf(current).map((opt) => (
              <button key={opt.value} type="button" className="bq-option" onClick={() => choose(opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button type="button" className="bq-link" onClick={back}>
              ← Back
            </button>
          )}
        </div>
      ) : (
        <div className="bq-body bq-result">
          <p className="bq-eyebrow">Your match</p>
          <p className="bq-product">{chosen ? chosen.label : "Our bestsellers"}</p>
          {picks.length > 0 && (
            <ul className="bq-picks">
              {picks.map((p) => (
                <li key={p.id}>
                  <Link to={`/product/${p.id}`} className="bq-pick">
                    {p.image && <img src={p.image} alt="" />}
                    <span className="bq-pick__text">
                      <span className="bq-pick__brand">{p.brand}</span>
                      <span className="bq-pick__name">{p.name}</span>
                    </span>
                    <span className="bq-pick__price">{formatPKR(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <button type="button" className="bq-cta" onClick={() => navigate(link)}>
            See all {chosen ? chosen.type : "products"}
          </button>
          <button type="button" className="bq-link" onClick={restart}>
            Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}
