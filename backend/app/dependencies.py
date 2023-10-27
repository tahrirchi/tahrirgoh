from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from contextlib import contextmanager

from app.utils.jwt import JWT
from app.db import crud
from app.db.base import User
from app.db.session import SessionLocal


reusable_oauth = OAuth2PasswordBearer(tokenUrl="user/authorize-swagger", scheme_name="JWT")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_x():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_user(token: str = Depends(reusable_oauth),
                   db: Session = Depends(get_db)) -> User:
    token_data = JWT.decode_access_token(token)
    user = crud.get(db, User, username=token_data.sub)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    return user


async def is_admin(token: str = Depends(reusable_oauth),
                   db: Session = Depends(get_db)) -> bool:

    token_data = JWT.decode_access_token(token)
    user = crud.get(db, User, username=token_data.sub)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Only admins have rights to this endpoint",
        )

    return True
