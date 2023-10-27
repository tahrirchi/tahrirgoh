from datetime import datetime
from sqlalchemy import func, case
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import crud
from app.api import schemas
from app.utils.jwt import pass_ctx, JWT
from app.db.base import User, Sentence, Annotation
from app.dependencies import get_db, is_admin, get_user


router = APIRouter(
    prefix='/user',
    tags=['User']
)


def zerofy(var):
    return 0 if var is None else var

def authorize(db: Session, username: str, password: str) -> schemas.TokenResponse:
    user = crud.get(db, User, username=username)

    if not user or not pass_ctx.verify(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return schemas.TokenResponse(
        access_token=JWT.create_access_token(user.username)
    )


@router.post("/create")
async def create_user(user_data: schemas.UserData,
                      db: Session = Depends(get_db),
                      _: bool = Depends(is_admin)):

    exists = crud.exists(db, User, username=user_data.username)
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    user = User(
        username=user_data.username,
        password=pass_ctx.hash(user_data.password),
        is_admin=False
    )
    crud.create(db, user)
    return {"detail": "User created"}


@router.post("/authorize-swagger", response_model=schemas.TokenResponse, include_in_schema=False)
async def authorize_swagger(auth_data: OAuth2PasswordRequestForm = Depends(),
                            db: Session = Depends(get_db)):

    return authorize(db, auth_data.username, auth_data.password)


@router.post("/authorize", response_model=schemas.TokenResponse)
async def authorize_user(auth_data: schemas.UserData,
                         db: Session = Depends(get_db)):

    return authorize(db, auth_data.username, auth_data.password)

@router.get("/report", response_model=schemas.UserReport)
async def get_report(username: str,
                     db: Session = Depends(get_db),
                     _: bool = Depends(get_user)):

    user = crud.get(db, User, username=username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    total_reviewed = db.query(Sentence)\
        .filter_by(reviewed_by=user.id)\
        .count()

    only_reviewed = db.query(Sentence)\
        .outerjoin(Annotation)\
        .filter(
            Sentence.reviewed_by == user.id,
            Annotation.id == None
        ).count()

    annotations_added = db.query(Sentence)\
        .join(Annotation)\
        .filter(Sentence.reviewed_by == user.id)\
        .count()

    total_score = (
        db.query(func.sum(
            case(
                (Annotation.error_type.like("S/%"), 150),
                (Annotation.error_type.like("Punctuation"), 250),
                (Annotation.error_type.like("G/%"), 300),
                (Annotation.error_type.like("F/%"), 400),
                else_=0)
            )
        ).join(Annotation.sentence).filter(
            Sentence.reviewed_by == user.id
        ).scalar()
    )
    total_score = zerofy(total_score)

    counts = (
        db.query(
            func.sum(case((Annotation.error_type.like("S/%"), 1), else_=0)).label("spelling"),
            func.sum(case((Annotation.error_type.like("G/%"), 1), else_=0)).label("grammar"),
            func.sum(case((Annotation.error_type == "Punctuation", 1), else_=0)).label("punctuation"),
            func.sum(case((Annotation.error_type.like("F/%"), 1), else_=0)).label("fluency")
        )
        .join(Annotation.sentence)
        .filter(Sentence.reviewed_by == user.id)
        .one()
    )

    return schemas.UserReport(
        username=user.username,
        annotations_added=annotations_added,
        only_reviewed=only_reviewed,
        total_reviewed=total_reviewed,
        calculated_score=total_score - user.paid_amount,
        error_type_count=schemas.ErrorTypeCount(
            spelling=zerofy(counts.spelling),
            punctuation=zerofy(counts.punctuation),
            grammar=zerofy(counts.grammar),
            fluency=zerofy(counts.fluency)
        )
    )


@router.post("/paid", response_model=schemas.PaidAmountResponse)
async def add_paid_amount(request: schemas.PaidAmount,
                          db: Session = Depends(get_db),
                          _: bool = Depends(is_admin)):
    user = crud.get(db, User, username=request.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.paid_amount += request.amount
    db.commit()
    db.refresh(user)

    return user
