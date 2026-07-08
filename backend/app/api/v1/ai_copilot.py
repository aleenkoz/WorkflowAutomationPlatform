from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.agents.hermes.workflows.summarize_active_projects import summarize_active_projects

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


@router.get("/projects/summary")
def ai_summary_active_projects(db: Session = Depends(get_db)):
    return summarize_active_projects(db)
