from fastapi import FastAPI
from pydantic import BaseModel
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from model.predict import predict_single

app = FastAPI(title="Churn Prediction API")

class CustomerData(BaseModel):
    tenure_months: float
    order_count: float
    days_since_last_order: float
    complain: int = 0

@app.get("/")
def root():
    return {"status": "Churn API running ✅"}

@app.post("/predict-churn")
def predict(data: CustomerData):
    return predict_single(
        data.tenure_months,
        data.order_count,
        data.days_since_last_order,
        data.complain
    )