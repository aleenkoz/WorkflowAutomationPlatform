from sqlalchemy import Column, Integer, String, Numeric, Date
from app.database.base import Base

class MaterialPrice(Base):
    __tablename__ = "material_prices"

    id = Column(Integer, primary_key=True, index=True)
    material_name = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    date = Column(Date, nullable=False)
    region = Column(String, nullable=False)
    source = Column(String, nullable=False)
    volatility_score = Column(Numeric(5, 2), nullable=False)
