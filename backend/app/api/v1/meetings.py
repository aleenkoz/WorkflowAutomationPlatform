from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.agents.hermes.workflows.weekly_meetings_summary import weekly_meeting_summary

router = APIRouter(prefix="/ai/meetings", tags=["AI Meetings"])

@router.get("/weekly-summary/{project_id}")
def get_weekly_summary(project_id: int, db: Session = Depends(get_db)):
    return weekly_meeting_summary(db, project_id)
