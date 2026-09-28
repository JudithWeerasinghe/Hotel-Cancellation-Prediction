from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from backend.database import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)

    hotel = Column(String)
    lead_time = Column(Float)
    adults = Column(Integer)
    children = Column(Float)
    babies = Column(Integer)
    adr = Column(Float)

    prediction = Column(String)
    cancellation_probability = Column(Float)
    risk_level = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)