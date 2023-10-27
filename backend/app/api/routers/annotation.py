from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import crud
from app.api import schemas
from app.db.base import Annotation, Sentence, User
from app.dependencies import get_user, get_db


router = APIRouter(
    prefix='/annotation',
    tags=['Annotation']
)


@router.post("")
async def add_annotations(annotations: schemas.AnnotationCreateBatch,
                          db: Session = Depends(get_db),
                          user: User = Depends(get_user)):

    exists = crud.exists(db, Sentence, id=annotations.sentence_id)

    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid sentence_id"
        )

    db.query(Annotation).filter_by(sentence_id=annotations.sentence_id).delete()

    db_annotations = [
        Annotation(
            sentence_id=annotations.sentence_id,
            from_index=a.from_index,
            to_index=a.to_index,
            new_value=a.new_value,
            old_value=a.old_value,
            error_type=a.error_type
        )
        for a in annotations.annotations
    ]
    db.bulk_save_objects(db_annotations)
    db.query(Sentence)\
        .filter_by(id=annotations.sentence_id)\
        .update({'reviewed_by': user.id, 'on_review': False})

    db.commit()

    return {"detail": f"Set {len(db_annotations)} annotations to sentence"}
