from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.memory_service import search_memory

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["Project Memory"]
)

@router.get("/{project_id}/memory")
def get_project_memory(project_id: int, db: Session = Depends(get_db)):
    return search_memory(db, project_id)
