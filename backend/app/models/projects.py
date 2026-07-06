from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Numeric, Boolean
from sqlalchemy.orm import relationship
from app.databse.base import Base

"""
This module defines the SQLAlchemy models for the project management system, 
including projects, phases, milestones, budgets, risks, issues, and decisions.
Each model corresponds to a database table and includes relationships to other models where applicable.
"""
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    client_name = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=False, default="planned")
    description = Column(Text, nullable=True)

    phases = relationship("ProjectPhase", back_populates="project")
    milestones = relationship("ProjectMilestone", back_populates="project")
    budgets = relationship("ProjectBudget", back_populates="project")
    risks = relationship("ProjectRisk", back_populates="project")
    issues = relationship("ProjectIssue", back_populates="project")
    decisions = relationship("ProjectDecision", back_populates="project")


class ProjectPhase(Base):
    __tablename__ = "project_phases"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    name = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    project = relationship("Project", back_populates="phases")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    name = Column(String(255), nullable=False)
    due_date = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)

    project = relationship("Project", back_populates="milestones")


class ProjectBudget(Base):
    __tablename__ = "project_budgets"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    category = Column(String(255), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(10), default="SAR")

    project = relationship("Project", back_populates="budgets")


class ProjectRisk(Base):
    __tablename__ = "project_risks"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    likelihood = Column(String(50), nullable=True)  # low/medium/high
    impact = Column(String(50), nullable=True)      # low/medium/high
    owner = Column(String(255), nullable=True)
    status = Column(String(50), default="open")

    project = relationship("Project", back_populates="risks")


class ProjectIssue(Base):
    __tablename__ = "project_issues"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="open")
    owner = Column(String(255), nullable=True)

    project = relationship("Project", back_populates="issues")


class ProjectDecision(Base):
    __tablename__ = "project_decisions"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    decided_by = Column(String(255), nullable=True)
    decision_date = Column(Date, nullable=True)
    reference = Column(String(255), nullable=True)  # meeting id, RFI id, etc.

    project = relationship("Project", back_populates="decisions")
