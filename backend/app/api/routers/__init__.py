from fastapi import FastAPI

from .sentence import router as sentence_router
from .annotation import router as annotation_router
from .user import router as user_router


def register_routers(app: FastAPI):
    app.include_router(sentence_router)
    app.include_router(annotation_router)
    app.include_router(user_router)
