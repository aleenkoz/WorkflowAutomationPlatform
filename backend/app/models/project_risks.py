from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.base import Base

class ProjectRisk(Base):
    __tablename__ = "project_risks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    email_id = Column(Integer, ForeignKey("generated_documents.id"), nullable=False)
    risk_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    description = Column(Text, nullable=False)
    detected_at = Column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="risks")
    email = relationship("GeneratedDocument", back_populates="risks")
