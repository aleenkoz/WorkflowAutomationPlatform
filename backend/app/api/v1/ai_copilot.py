from fastapi import APIRouter
from app.agents.hermes.workflows.summarize_active_projects import summarize_active_projects

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

@router.get("/projects/summary")
def ai_summary_active_projects():
    return summarize_active_projects()
