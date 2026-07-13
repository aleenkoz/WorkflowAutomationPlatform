from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.agents.hermes.workflows.chat import run_chat

# IMPORTANT: Must match frontend
router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


@router.post("")
def chat(
    project_id: int,
    message: str,
    db: Session = Depends(get_db),
):
    return run_chat(db, message, project_id)
