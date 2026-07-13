from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.agents.hermes.workflows.summarize_active_projects import summarize_active_projects
from app.agents.hermes.workflows.material_price_intelligence import run_material_price_intelligence
from app.agents.hermes.workflows.project_intelligence import project_intelligence


router = APIRouter(prefix="/api/v1/ai", tags=["ai"])



@router.get("/project-summary/{project_id}")
def get_project_summary(project_id: int, db: Session = Depends(get_db)):
    # The original version filtered summaries by project_id
    return summarize_active_projects(db, project_id)

@router.post("/materials/price-intelligence")
def material_price_intelligence(db=Depends(get_db)):
    result = run_material_price_intelligence(db)
    return result


@router.get("/intelligence/{project_id}")
def get_project_intelligence(project_id: int, db: Session = Depends(get_db)):
    return project_intelligence(db, project_id)