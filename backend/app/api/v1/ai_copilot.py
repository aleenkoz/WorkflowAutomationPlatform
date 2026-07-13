from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.agents.hermes.workflows.summarize_active_projects import summarize_active_projects
from app.agents.hermes.workflows.material_price_intelligence import run_material_price_intelligence


router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


@router.get("/projects/summary")
def ai_summary_active_projects(db: Session = Depends(get_db)):
    return summarize_active_projects(db)

@router.post("/materials/price-intelligence")
def material_price_intelligence(db=Depends(get_db)):
    result = run_material_price_intelligence(db)
    return result
