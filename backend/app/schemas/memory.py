from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class MemoryEntryBase(BaseModel):
    project_id: int
    entry_type: str
    source_id: Optional[int] = None
    source_type: Optional[str] = None
    content: str
    meta: Optional[Dict[str, Any]] = None


class MemoryEntryRead(MemoryEntryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
