from fastapi import FastAPI
from app.api.v1 import projects

app = FastAPI(title="Construction AI Platform")

app.include_router(projects.router)
