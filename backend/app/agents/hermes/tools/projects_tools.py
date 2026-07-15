from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.projects import Project
from app.models.meetings import Meeting

"""
Tools for functions that interact with the database, 
specifically for projects and meetings.
"""

def fetch_active_or_on_hold_projects(db: Session):
    """
    Fetch all projects that are active or on-hold.
    Case-insensitive matching to support values like:
    ACTIVE, active, Active, ON HOLD, on hold, On Hold, etc.
    Returns ORM objects.
    """

    return (
        db.query(Project)
        .filter(
            func.lower(Project.status).in_(["active", "on hold"])
        )
        .all()
    )


def fetch_meetings_for_project(db: Session, project_id: int):
    """
    Fetch all meetings for a given project.
    Returns formatted dictionaries.
    """

    meetings = (
        db.query(Meeting)
        .filter(Meeting.project_id == project_id)
        .order_by(Meeting.meeting_date.desc())
        .all()
    )

    return [
        {
            "id": m.id,
            "project_id": m.project_id,
            "meeting_date": m.meeting_date.isoformat(),
            "title": m.title,
            "meeting_type": m.meeting_type
        }
        for m in meetings
    ]
