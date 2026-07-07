from app.database.session import get_db
from app.models.projects import Project

def fetch_active_or_on_hold_projects():
    db = next(get_db())

    projects = (
        db.query(Project)
        .filter(Project.status.in_(["Active", "On hold"]))
        .all()
    )

    formatted = [
        {
            "id": p.id,
            "name": p.name,
            "client": p.client_name,
            "location": p.location,
            "status": p.status,
            "start_date": str(p.start_date),
            "end_date": str(p.end_date),
            "status": p.status,
            "description": p.description,
        }
        for p in projects
    ]

    return formatted
