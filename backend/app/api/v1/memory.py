from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database.session import get_db
from app.services.memory_service import search_memory
from app.schemas.memory import MemoryEntryRead

router = APIRouter(prefix="/memory", tags=["Memory"])

@router.get("/search/{project_id}", response_model=List[MemoryEntryRead])
def search_project_memory(
    project_id: int,
    q: Optional[str] = Query(None),
    entry_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    entries = search_memory(db, project_id, query=q, entry_type=entry_type)
    return entries
