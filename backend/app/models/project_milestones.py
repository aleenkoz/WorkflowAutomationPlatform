from sqlalchemy import Column, Integer, String, Date, Boolean
from app.database.base import Base

class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True)
    name = Column(String(255), nullable=False)
    due_date = Column(Date, nullable=False)
    completed = Column(Boolean, default=False)
