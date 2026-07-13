from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel

from app.database.session import get_db
from app.services.memory_service import (
    search_memory,
    get_recent_memory,
    get_relevant_memory,
    store_chat_memory,
)
from app.schemas.memory import MemoryEntryRead

# IMPORTANT: This must match the frontend
router = APIRouter(prefix="/api/v1/memory", tags=["Memory"])


# ---------------------------------------------------------
# Search project memory
# ---------------------------------------------------------
@router.get("/search/{project_id}", response_model=List[MemoryEntryRead])
def search_project_memory(
    project_id: int,
    q: Optional[str] = Query(None),
    entry_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return search_memory(db, project_id, query=q, entry_type=entry_type)


# ---------------------------------------------------------
# Store chat interaction (JSON body)
# ---------------------------------------------------------

class ChatStoreRequest(BaseModel):
    project_id: int
    user_message: str
    hermes_answer: str

@router.post("/chat/store", response_model=MemoryEntryRead)
def store_chat_interaction(
    payload: ChatStoreRequest,
    db: Session = Depends(get_db),
):
    print("🔥 JSON version of store_chat_interaction is active")
    return store_chat_memory(
        db=db,
        project_id=payload.project_id,
        user_message=payload.user_message,
        hermes_answer=payload.hermes_answer,
    )


# ---------------------------------------------------------
# Get relevant memory for chat context
# ---------------------------------------------------------
@router.get("/chat/relevant/{project_id}", response_model=List[str])
def get_chat_relevant_memory(
    project_id: int,
    message: str = Query(...),
    limit: int = Query(5),
    db: Session = Depends(get_db),
):
    return get_relevant_memory(
        db=db,
        project_id=project_id,
        message=message,
        limit=limit,
    )


# ---------------------------------------------------------
# Get recent memory entries
# ---------------------------------------------------------
@router.get("/chat/recent/{project_id}", response_model=List[str])
def get_chat_recent_memory(
    project_id: int,
    limit: int = Query(5),
    entry_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return get_recent_memory(
        db=db,
        project_id=project_id,
        limit=limit,
        entry_type=entry_type,
    )


# ---------------------------------------------------------
# Get all chat interactions
# ---------------------------------------------------------
@router.get("/chat/all/{project_id}", response_model=List[MemoryEntryRead])
def get_all_chat_interactions(
    project_id: int,
    db: Session = Depends(get_db),
):
    return search_memory(
        db=db,
        project_id=project_id,
        entry_type="chat_interaction",
    )
