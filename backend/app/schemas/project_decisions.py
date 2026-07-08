from pydantic import BaseModel
from datetime import date

class ProjectDecisionRead(BaseModel):
    id: int
    project_id: int
    title: str
    description: str | None
    decided_by: str
    decision_date: date
    reference: str | None

    class Config:
        orm_mode = True
