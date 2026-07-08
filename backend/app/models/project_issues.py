from sqlalchemy import Column, Integer, String, Text
from app.database.base import Base

class ProjectIssue(Base):
    __tablename__ = "project_issues"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False)
    owner = Column(String(255), nullable=True)
