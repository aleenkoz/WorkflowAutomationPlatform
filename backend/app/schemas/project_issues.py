from pydantic import BaseModel

class ProjectIssueRead(BaseModel):
    id: int
    project_id: int
    title: str
    description: str | None
    status: str
    owner: str | None

    class Config:
        orm_mode = True
