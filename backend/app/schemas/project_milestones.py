from pydantic import BaseModel
from datetime import date

class ProjectMilestoneRead(BaseModel):
    id: int
    project_id: int
    name: str
    due_date: date
    completed: bool

    class Config:
        orm_mode = True
