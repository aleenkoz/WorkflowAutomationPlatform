from fastapi import APIRouter
from app.agents.hermes.workflows.risk_detection import run_risk_detection

router = APIRouter(prefix="/api/v1/ai", tags=["risk-detection"])

@router.post("/detect-risks")
def detect_risks():
    return run_risk_detection()
