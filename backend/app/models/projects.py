from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.base import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), nullable=False, default="Active")
    client_name = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    start_date = Column(String(50), nullable=True)  
    end_date = Column(String(50), nullable=True)

    generated_documents = relationship(
    "GeneratedDocument",
    back_populates="project",
    cascade="all, delete"
    )

    risks = relationship(
    "ProjectRisk",
    back_populates="project",
    cascade="all, delete"
    )

