from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.projects import ProjectCreate, ProjectRead, ProjectRiskCreate, ProjectRiskRead
from app.services import projects_service

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.post("", response_model=ProjectRead)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    project = projects_service.create_project(db, payload)
    return project


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = projects_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/{project_id}/risks", response_model=ProjectRiskRead)
def create_project_risk(project_id: int, payload: ProjectRiskCreate, db: Session = Depends(get_db)):
    project = projects_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    risk = projects_service.add_project_risk(db, project_id, payload)
    return risk
