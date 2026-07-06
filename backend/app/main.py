from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Specify the frontend addresses allowed to communicate with your backend
origins = [
    "http://localhost:3000",  # Default local port for this frontend
    "https://*.run.app",       # For preview environments if running on cloud servers
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For quick local testing, you can use ["*"], but specify origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)