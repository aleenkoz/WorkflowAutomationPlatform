from pydantic import BaseModel
from decimal import Decimal

class ProjectBudgetRead(BaseModel):
    id: int
    project_id: int
    category: str
    amount: Decimal
    currency: str

    class Config:
        orm_mode = True
