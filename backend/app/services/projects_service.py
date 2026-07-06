from sqlalchemy.orm import Session
from app.models.projects import Project, ProjectRisk
from app.schemas.projects import ProjectCreate, ProjectRiskCreate

"""
This module provides service functions for managing projects and their associated risks.
"""

def create_project(db: Session, data: ProjectCreate) -> Project:
    project = Project(**data.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_project(db: Session, project_id: int) -> Project | None:
    return db.query(Project).filter(Project.id == project_id).first()


def add_project_risk(db: Session, project_id: int, data: ProjectRiskCreate) -> ProjectRisk:
    risk = ProjectRisk(project_id=project_id, **data.dict())
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk

def list_projects(db: Session):
    return db.query(Project).all()

def delete_project(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        db.delete(project)
        db.commit()

