import pandas as pd

FEATURES = ["tenure_months", "order_count", "days_since_last_order", "complain"]

def load_data(path="data/raw/E Commerce Dataset.xlsx"):
    df = pd.read_excel(path, sheet_name="E Comm")
    df = df[["Churn","Tenure","OrderCount","DaySinceLastOrder","Complain"]].copy()
    df = df.rename(columns={
        "Churn":             "churn",
        "Tenure":            "tenure_months",
        "OrderCount":        "order_count",
        "DaySinceLastOrder": "days_since_last_order",
        "Complain":          "complain",
    })
    for col in FEATURES:
        df[col] = df[col].fillna(df[col].median())
    return df

if __name__ == "__main__":
    df = load_data()
    print(df.head())
    print("Shape:", df.shape)
    print(df["churn"].value_counts())