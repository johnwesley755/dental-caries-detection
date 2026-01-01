from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Configure engine with SSL and connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True,  # Verify connections before using them
    pool_recycle=300,  # Recycle connections after 5 minutes
    pool_size=10,  # Connection pool size
    max_overflow=20,  # Max overflow connections
    connect_args={
        "sslmode": "require",  # Require SSL for PostgreSQL
        "connect_timeout": 10,  # Connection timeout in seconds
    }
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()