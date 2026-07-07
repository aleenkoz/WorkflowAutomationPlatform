from sqlalchemy.orm import Session
from app.models.project_risks import ProjectRisk
from app.schemas.project_risks import ProjectRiskCreate

def create_risk(db: Session, risk: ProjectRiskCreate):
    if risk.risk_type == "None":
        return None

    db_risk = ProjectRisk(**risk.dict())
    db.add(db_risk)
    db.commit()
    db.refresh(db_risk)
    return db_risk
