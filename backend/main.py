import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from models.database import engine, Base, get_db
from routers import employees, engineers, tickets, auth
from alembic import command
from alembic.config import Config
from seed_data import seed_default_admin

app = FastAPI(title="SupportHub API", version="1.0.0")

app_id = os.getenv("APP_ID", "")
preview_domain = os.getenv("PREVIEW_DOMAIN", "")
preview_scheme = "https" if os.getenv("PREVIEW_USE_HTTPS", "false").lower() == "true" else "http"

if app_id and preview_domain:
    azure_preview_url = f"{preview_scheme}://app-{app_id}.{preview_domain}"
    allowed_origins = [
        azure_preview_url,
        "http://frontend:4000",
        "http://localhost:4000",
        "http://localhost:3000"
    ]
else:
    allowed_origins = [
        "http://localhost:4000",
        "http://frontend:4000",
        "http://localhost:3000",
        "http://frontend:3000"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_startup_migrations(engine, database_url, lock_name):
    with engine.connect() as conn:
        acquired = conn.execute(
            text("SELECT GET_LOCK(:lock_name, 60)"),
            {"lock_name": lock_name},
        ).scalar()
        if not acquired:
            raise RuntimeError("Could not acquire migration lock")
        try:
            alembic_cfg = Config("alembic.ini")
            alembic_cfg.set_main_option("sqlalchemy.url", database_url)
            command.upgrade(alembic_cfg, "head")
        finally:
            conn.execute(
                text("SELECT RELEASE_LOCK(:lock_name)"),
                {"lock_name": lock_name},
            )

@app.on_event("startup")
def startup_event():
    from models.database import DATABASE_URL, MYSQL_DB
    run_startup_migrations(engine, DATABASE_URL, f"migration_lock_{MYSQL_DB}")
    seed_default_admin()

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(employees.router, prefix="/api", tags=["employees"])
app.include_router(engineers.router, prefix="/api", tags=["engineers"])
app.include_router(tickets.router, prefix="/api", tags=["tickets"])

@app.get("/")
def read_root():
    return {"message": "SupportHub API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}