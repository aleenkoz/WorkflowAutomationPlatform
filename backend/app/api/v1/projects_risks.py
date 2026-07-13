from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.agents.hermes.workflows.risk_detection import run_risk_detection

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["Project Risks"]
)

@router.get("/{project_id}/risks")
def get_project_risks(project_id: int, db: Session = Depends(get_db)):
    return run_risk_detection(db, project_id)
