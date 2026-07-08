from sqlalchemy.orm import Session
from app.models.project_decisions import ProjectDecision

def get_decisions_by_project(db: Session, project_id: int):
    return db.query(ProjectDecision).filter(ProjectDecision.project_id == project_id).all()
