from sqlalchemy.orm import Session
from app.models.meetings import Meeting

ALL_MEETING_TYPES = ["Technical", "Safety", "Weekly", "Commercial"]

def get_meetings_for_project(db: Session, project_id: int):
    return (
        db.query(Meeting)
        .filter(Meeting.project_id == project_id)
        .order_by(Meeting.meeting_date.desc())
        .all()
    )

def analyze_meeting_types(meetings):
    completed = {m.meeting_type for m in meetings}
    missing = [t for t in ALL_MEETING_TYPES if t not in completed]

    return {
        "completed": list(completed),
        "missing": missing
    }
