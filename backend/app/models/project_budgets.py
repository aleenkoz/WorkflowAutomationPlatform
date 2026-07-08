from sqlalchemy import Column, Integer, String, Numeric
from app.database.base import Base

class ProjectBudget(Base):
    __tablename__ = "project_budgets"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True)
    category = Column(String(255), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(10), nullable=False)
