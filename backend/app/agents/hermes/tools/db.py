from app.database.session import get_db


def fetch_all_projects():
    db = next(get_db())
    return db.query(Project).all()
