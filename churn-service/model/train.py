import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import joblib
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from features.feature_engineering import load_data, FEATURES

def train():
    print("📂 Data load ho raha hai...")
    df = load_data()
    print(f"✅ Rows: {len(df)} | Churn rate: {df['churn'].mean()*100:.1f}%")

    X, y = df[FEATURES], df["churn"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = lgb.LGBMClassifier(
        n_estimators=200,
        learning_rate=0.05,
        scale_pos_weight=(y==0).sum()/(y==1).sum(),
        random_state=42,
        verbose=-1
    )
    model.fit(X_train, y_train)

    print("\n📊 Model Performance:")
    print(classification_report(y_test, model.predict(X_test),
          target_names=["Active","Churned"]))

    joblib.dump(model, "model/churn_model.pkl")
    joblib.dump({"low": 0.15, "medium": 0.40}, "model/thresholds.pkl")
    print("✅ Model saved → model/churn_model.pkl")

if __name__ == "__main__":
    train()