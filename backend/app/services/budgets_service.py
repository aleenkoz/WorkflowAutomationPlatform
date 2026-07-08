from sqlalchemy.orm import Session
from app.models.project_budgets import ProjectBudget

def get_budgets_by_project(db: Session, project_id: int):
    return db.query(ProjectBudget).filter(ProjectBudget.project_id == project_id).all()
