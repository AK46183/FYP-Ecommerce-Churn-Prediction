import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import joblib, pandas as pd
from features.feature_engineering import FEATURES

_model = _thresh = None

def _load():
    global _model, _thresh
    if _model is None:
        _model  = joblib.load(os.path.join(os.path.dirname(__file__), "churn_model.pkl"))
        _thresh = joblib.load(os.path.join(os.path.dirname(__file__), "thresholds.pkl"))

def predict_single(tenure_months, order_count, days_since_last_order, complain=0):
    _load()
    row = pd.DataFrame([{
        "tenure_months":         tenure_months,
        "order_count":           order_count,
        "days_since_last_order": days_since_last_order,
        "complain":              complain
    }])
    prob = float(_model.predict_proba(row[FEATURES])[0][1])
    risk = "Low" if prob < _thresh["low"] else ("Medium" if prob < _thresh["medium"] else "High")
    return {"churn_probability": round(prob, 4), "risk_level": risk}

if __name__ == "__main__":
    r1 = predict_single(tenure_months=2, order_count=1,
                        days_since_last_order=60, complain=1)
    print(f"High Risk Expected   → {r1}")

    r2 = predict_single(tenure_months=24, order_count=15,
                        days_since_last_order=3, complain=0)
    print(f"Low Risk Expected    → {r2}")

    r3 = predict_single(tenure_months=6, order_count=4,
                        days_since_last_order=25, complain=0)
    print(f"Medium Risk Expected → {r3}")