from typing import Any
from sqlalchemy.orm import Session
from .base import Base


def exists(db: Session, model: Base, **fields) -> bool:
    exists_query = db.query(model).filter_by(**fields).exists()
    return db.query(exists_query).scalar()


def get(db: Session, model: Base, **fields):
    return db.query(model).filter_by(**fields).first()


def create(db: Session, model_object: Any) -> Any:
    db.add(model_object)
    db.commit()
    db.refresh(model_object)
    return model_object
