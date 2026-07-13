from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

# Project schemas & service
from app.schemas.projects import ProjectCreate, ProjectRead
from app.services import projects_service

# New schemas
from app.schemas.project_phases import ProjectPhaseRead
from app.schemas.project_milestones import ProjectMilestoneRead
from app.schemas.project_budgets import ProjectBudgetRead
from app.schemas.project_issues import ProjectIssueRead
from app.schemas.project_decisions import ProjectDecisionRead

# New services
from app.services.phases_service import get_phases_by_project
from app.services.milestones_service import get_milestones_by_project
from app.services.budgets_service import get_budgets_by_project
from app.services.issues_service import get_issues_by_project
from app.services.decisions_service import get_decisions_by_project
from app.agents.hermes.workflows import project_intelligence
from app.agents.hermes.workflows.weekly_meetings_summary import weekly_meeting_summary


router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


# ---------------------------------------------------------
# PROJECT CRUD
# ---------------------------------------------------------

@router.get("", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    return projects_service.list_projects(db)


@router.post("", response_model=ProjectRead)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    return projects_service.create_project(db, payload)


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = projects_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = projects_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    projects_service.delete_project(db, project_id)
    return {"message": "Project deleted successfully"}


# ---------------------------------------------------------
# PHASES
# ---------------------------------------------------------

@router.get("/{project_id}/phases", response_model=list[ProjectPhaseRead])
def get_project_phases(project_id: int, db: Session = Depends(get_db)):
    return get_phases_by_project(db, project_id)


# ---------------------------------------------------------
# MILESTONES
# ---------------------------------------------------------

@router.get("/{project_id}/milestones", response_model=list[ProjectMilestoneRead])
def get_project_milestones(project_id: int, db: Session = Depends(get_db)):
    return get_milestones_by_project(db, project_id)


# ---------------------------------------------------------
# BUDGETS
# ---------------------------------------------------------

@router.get("/{project_id}/budgets", response_model=list[ProjectBudgetRead])
def get_project_budgets(project_id: int, db: Session = Depends(get_db)):
    return get_budgets_by_project(db, project_id)


# ---------------------------------------------------------
# ISSUES
# ---------------------------------------------------------

@router.get("/{project_id}/issues", response_model=list[ProjectIssueRead])
def get_project_issues(project_id: int, db: Session = Depends(get_db)):
    return get_issues_by_project(db, project_id)


# ---------------------------------------------------------
# DECISIONS
# ---------------------------------------------------------

@router.get("/{project_id}/decisions", response_model=list[ProjectDecisionRead])
def get_project_decisions(project_id: int, db: Session = Depends(get_db)):
    return get_decisions_by_project(db, project_id)


@router.get("/intelligence/{project_id}")
def get_project_intelligence(project_id: int, db: Session = Depends(get_db)):
    return project_intelligence(db, project_id)

@router.get("/{project_id}/weekly-summary")
def get_weekly_summary(project_id: int, db: Session = Depends(get_db)):
    return weekly_meeting_summary(db, project_id)
