from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import update, text
from apscheduler.schedulers.background import BackgroundScheduler

from app.db.base import Sentence
from app.db.session import engine, Base
from app.core.config import settings
from app.dependencies import get_db_x
from app.api.routers import register_routers


Base.metadata.create_all(bind=engine)


app = FastAPI(title=settings.PROJECT_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_routers(app)


def unlock_sentences():
    with get_db_x() as db:
        stmt = (
            update(Sentence)
            .filter_by(on_review=True)
            .filter(text("NOW() - review_timestamp >= interval '1 hour'"))
            .values(on_review=False)
        )

        result = db.execute(stmt)

        if result.rowcount > 0:
            print(f"[Scheduler]: Unlocked {result.rowcount} sentences")
            db.commit()


def schedule_background_task():
    scheduler = BackgroundScheduler()
    scheduler.add_job(unlock_sentences, 'interval', minutes=5)
    scheduler.start()


@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    return RedirectResponse("/api/docs")


sub_app = app
app = FastAPI()
app.mount("/api", sub_app)


@app.on_event("startup")
async def startup_event():
    schedule_background_task()

