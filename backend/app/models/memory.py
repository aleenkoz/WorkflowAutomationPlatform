from sqlalchemy import Column, Integer, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base

class MemoryEntry(Base):
    __tablename__ = "memory_entries"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    entry_type = Column(Text, nullable=False)
    source_id = Column(Integer, nullable=True)
    source_type = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    meta = Column(JSON, nullable=True)  # <-- FIXED
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="memory_entries")
