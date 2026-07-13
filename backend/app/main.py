from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# ---------------------------
# Import Routers
# ---------------------------
from app.api.v1.projects import router as projects_router
from app.api.v1.ai_copilot import router as ai_router
from app.api.v1.risk_detection import router as risk_router
from app.api.v1.meetings import router as ai_meetings_router
from app.api.v1.memory import router as memory_router
from app.api.v1.chat import router as chat_router

# ---------------------------
# DB Session
# ---------------------------
from app.database.session import get_db

# ---------------------------
# Hermes Workflows
# ---------------------------
from app.agents.hermes.workflows.project_intelligence import project_intelligence


# ---------------------------
# FastAPI App
# ---------------------------
app = FastAPI(
    title="Construction Operations Intelligence Platform",
    version="1.0.0",
)


# ---------------------------
# CORS Configuration
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fully open for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Health Check
# ---------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "FastAPI backend is running"}


# ---------------------------
# Register Core Routers
# ---------------------------
app.include_router(projects_router)
app.include_router(ai_router)
app.include_router(risk_router)
app.include_router(ai_meetings_router)
app.include_router(memory_router)
app.include_router(chat_router)  


# ---------------------------
# Project Intelligence Router
# ---------------------------
intelligence_router = APIRouter(prefix="/ai/projects", tags=["AI Projects"])

@intelligence_router.get("/intelligence/{project_id}")
def get_project_intelligence(project_id: int, db: Session = Depends(get_db)):
    return project_intelligence(db, project_id)

app.include_router(intelligence_router)

