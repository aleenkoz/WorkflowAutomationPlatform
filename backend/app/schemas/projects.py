from datetime import date
from typing import Optional, List
from pydantic import BaseModel

"""
This module defines the Pydantic schemas for the project management system,
including projects, phases, milestones, budgets, risks, issues, and decisions.

"""
class ProjectBase(BaseModel):
    name: str
    client_name: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = "planned"
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int

    class Config:
        from_attributes = True


class ProjectRiskBase(BaseModel):
    title: str
    description: Optional[str] = None
    likelihood: Optional[str] = None
    impact: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = "open"


class ProjectRiskCreate(ProjectRiskBase):
    pass


class ProjectRiskRead(ProjectRiskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
