from sqlalchemy.orm import Session
from app.models.project_milestones import ProjectMilestone

def get_milestones_by_project(db: Session, project_id: int):
    return db.query(ProjectMilestone).filter(ProjectMilestone.project_id == project_id).all()
