from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    meeting_date = Column(Date, nullable=False)
    title = Column(String(255), nullable=False)
    meeting_type = Column(String(50), nullable=False)

    project = relationship("Project", back_populates="meetings")
