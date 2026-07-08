from sqlalchemy.orm import Session
from app.models.project_issues import ProjectIssue

def get_issues_by_project(db: Session, project_id: int):
    return db.query(ProjectIssue).filter(ProjectIssue.project_id == project_id).all()
