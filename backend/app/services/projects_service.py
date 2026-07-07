from sqlalchemy.orm import Session
from app.models.projects import Project
from app.schemas.projects import ProjectCreate

def list_projects(db: Session):
    return db.query(Project).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

def delete_project(db: Session, project_id: int):
    project = get_project(db, project_id)
    if not project:
        return False
    db.delete(project)
    db.commit()
    return True


def create_project(db: Session, payload: ProjectCreate):
    project = Project(
        name=payload.name,
        description=payload.description,
        status=payload.status,
        client_name=payload.client_name
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
