from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session

DATABASE_URL = "postgresql+psycopg2://admin:admin@localhost:5432/workflow"

engine = create_engine(
    DATABASE_URL,
    echo=False,          
    future=True
)

# Create a session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session
)

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
