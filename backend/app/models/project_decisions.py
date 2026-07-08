from sqlalchemy import Column, Integer, String, Text, Date
from app.database.base import Base

class ProjectDecision(Base):
    __tablename__ = "project_decisions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    decided_by = Column(String(255), nullable=False)
    decision_date = Column(Date, nullable=False)
    reference = Column(String(255), nullable=True)
