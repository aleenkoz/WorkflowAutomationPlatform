from sqlalchemy.orm import Session
from app.models.project_phases import ProjectPhase

def get_phases_by_project(db: Session, project_id: int):
    return db.query(ProjectPhase).filter(ProjectPhase.project_id == project_id).all()
