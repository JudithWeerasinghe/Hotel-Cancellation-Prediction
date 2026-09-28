import xgboost as xgb
from pathlib import Path
from backend.preprocessing import preprocess_booking_input, validate_booking_input


# Find the project root folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Load the trained XGBoost model
model = xgb.XGBClassifier()
model.load_model(BASE_DIR / "models" / "final_model.json")


def predict_cancellation(processed_input):
    prediction = model.predict(processed_input)[0]
    probability = model.predict_proba(processed_input)[0][1]

    return {
        "prediction": "Cancelled" if prediction == 1 else "Not Cancelled",
        "cancellation_probability": round(float(probability), 4),
        "risk_level": "High" if probability >= 0.5 else "Low"
    }

def get_cancellation_prediction(booking_dict):
    errors = validate_booking_input(booking_dict)

    if errors:
        return {
            "success": False,
            "errors": errors
        }

    processed_input = preprocess_booking_input(booking_dict)

    result = predict_cancellation(processed_input)

    return {
        "success": True,
        "errors": [],
        **result
    }