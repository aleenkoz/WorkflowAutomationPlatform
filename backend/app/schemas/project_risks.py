from pydantic import BaseModel
from datetime import datetime

class ProjectRiskBase(BaseModel):
    project_id: int
    email_id: int
    risk_type: str
    severity: str
    description: str

class ProjectRiskCreate(ProjectRiskBase):
    pass

class ProjectRisk(ProjectRiskBase):
    id: int
    detected_at: datetime

    class Config:
        orm_mode = True
