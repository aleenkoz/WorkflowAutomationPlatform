from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class PriceChangeAlert(Base):
    __tablename__ = "price_change_alerts"

    id = Column(Integer, primary_key=True, index=True)
    material = Column(String, nullable=False)
    predicted_change = Column(String, nullable=False)
    confidence = Column(Numeric(5,2), nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
