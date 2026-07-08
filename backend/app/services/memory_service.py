from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.memory import MemoryEntry

def add_memory_entry(
    db: Session,
    project_id: int,
    entry_type: str,
    content: str,
    source_id: Optional[int] = None,
    source_type: Optional[str] = None,
    meta: Optional[dict] = None,
):
    entry = MemoryEntry(
        project_id=project_id,
        entry_type=entry_type,
        source_id=source_id,
        source_type=source_type,
        content=content,
        meta=meta or {},
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def search_memory(
    db: Session,
    project_id: int,
    query: Optional[str] = None,
    entry_type: Optional[str] = None,
) -> List[MemoryEntry]:
    q = db.query(MemoryEntry).filter(MemoryEntry.project_id == project_id)

    if entry_type:
        q = q.filter(MemoryEntry.entry_type == entry_type)

    if query:
        q = q.filter(MemoryEntry.content.ilike(f"%{query}%"))

    return q.order_by(MemoryEntry.created_at.desc()).all()
