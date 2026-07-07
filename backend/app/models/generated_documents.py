from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class GeneratedDocument(Base):
    __tablename__ = "generated_documents"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    related_record_id = Column(Integer)
    document_date = Column(String(50))
    sender = Column(String(255))
    recipient = Column(String(255))
    subject = Column(String(255))
    body = Column(Text)

    project = relationship("Project", back_populates="generated_documents")

    risks = relationship(
    "ProjectRisk",
    back_populates="email",
    cascade="all, delete"
    )
