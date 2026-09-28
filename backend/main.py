from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.model import get_cancellation_prediction
from backend.schemas import BookingInput
from backend.database import SessionLocal
from backend.database_models import PredictionHistory



app = FastAPI(
    title="Hotel Cancellation Prediction API",
    description="API for predicting hotel booking cancellation risk",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Hotel Cancellation Prediction API is running"
    }


@app.post("/predict")
def predict(booking: BookingInput):
    booking_dict = booking.model_dump()

    result = get_cancellation_prediction(booking_dict)

    if result["success"]:
        db = SessionLocal()

        prediction_record = PredictionHistory(
            hotel=booking_dict["hotel"],
            lead_time=booking_dict["lead_time"],
            adults=booking_dict["adults"],
            children=booking_dict["children"],
            babies=booking_dict["babies"],
            adr=booking_dict["adr"],
            prediction=result["prediction"],
            cancellation_probability=result["cancellation_probability"],
            risk_level=result["risk_level"]
        )

        db.add(prediction_record)
        db.commit()
        db.close()

    return result

@app.get("/predictions")
def get_predictions():
    db = SessionLocal()

    records = db.query(PredictionHistory).order_by(
        PredictionHistory.id.desc()
    ).all()

    db.close()

    return [
        {
            "id": record.id,
            "hotel": record.hotel,
            "lead_time": record.lead_time,
            "adults": record.adults,
            "children": record.children,
            "babies": record.babies,
            "adr": record.adr,
            "prediction": record.prediction,
            "cancellation_probability": record.cancellation_probability,
            "risk_level": record.risk_level,
            "created_at": record.created_at
        }
        for record in records
    ]