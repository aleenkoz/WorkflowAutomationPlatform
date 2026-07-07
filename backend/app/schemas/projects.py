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
    status: Optional[str] = None
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    name: str
    description: str | None = None
    status: str = "Active"
    client_name: str | None = None
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None


class ProjectRead(ProjectBase):
    id: int

    class Config:
        from_attributes = True


