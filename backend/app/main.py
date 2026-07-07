from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your API routers
from app.api.v1.projects import router as projects_router
from app.api.v1.ai_copilot import router as ai_router
from app.api.v1.risk_detection import router as risk_router


app = FastAPI(
    title="Construction Operations Intelligence Platform",
    version="1.0.0",
)

# ---------------------------
# 1. Include Routers
# ---------------------------
# This exposes:
# POST /api/v1/projects
# GET /api/v1/projects/{project_id}
# POST /api/v1/projects/{project_id}/risks
app.include_router(projects_router)


# ---------------------------
# 2. CORS Configuration
# ---------------------------
origins = [
    "http://localhost:3000",   # React local dev
    "https://*.run.app",       # Cloud preview environments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# 3. Health Check Endpoint
# ---------------------------
@app.get("/")
def root():
    return {"status": "ok", "message": "FastAPI backend is running"}

app.include_router(ai_router)
app.include_router(risk_router)
