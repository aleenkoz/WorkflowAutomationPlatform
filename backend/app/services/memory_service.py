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



def get_recent_memory(
    db: Session,
    project_id: int,
    limit: int = 5,
    entry_type: Optional[str] = None,
) -> List[str]:
    """
    Returns the most recent memory entries (content only).
    Useful for feeding context into Hermes.
    """
    q = db.query(MemoryEntry).filter(MemoryEntry.project_id == project_id)

    if entry_type:
        q = q.filter(MemoryEntry.entry_type == entry_type)

    entries = q.order_by(MemoryEntry.created_at.desc()).limit(limit).all()
    return [e.content for e in entries]


def store_chat_memory(
    db: Session,
    project_id: int,
    user_message: str,
    hermes_answer: str,
):
    """
    Stores chat interactions in the memory layer.
    """
    content = {
        "user_message": user_message,
        "hermes_answer": hermes_answer,
    }

    return add_memory_entry(
        db=db,
        project_id=project_id,
        entry_type="chat_interaction",
        content=str(content),
        source_type="chat",
    )


def get_relevant_memory(
    db: Session,
    project_id: int,
    message: str,
    limit: int = 5,
) -> List[str]:
    """
    Retrieves memory entries relevant to the user's message.
    Used for Hermes context injection.
    """
    q = db.query(MemoryEntry).filter(MemoryEntry.project_id == project_id)

    # Simple relevance heuristic: keyword match
    keyword = message.split()[0] if message else ""

    q = q.filter(MemoryEntry.content.ilike(f"%{keyword}%"))

    entries = q.order_by(MemoryEntry.created_at.desc()).limit(limit).all()
    return [e.content for e in entries]
