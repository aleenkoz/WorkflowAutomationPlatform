from pydantic import BaseModel
from datetime import date

class ProjectPhaseRead(BaseModel):
    id: int
    project_id: int
    name: str
    start_date: date | None
    end_date: date | None

    class Config:
        orm_mode = True
