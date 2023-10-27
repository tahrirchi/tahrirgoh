import json
from io import BytesIO
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import update, text
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Depends, HTTPException, status

from app.db import crud
from app.api import schemas
from app.db.base import Sentence, Annotation, User
from app.dependencies import get_db, get_user, is_admin


router = APIRouter(
    prefix='/sentence',
    tags=['Sentence']
)


@router.post("")
async def add_sentences(sentences: List[schemas.SentenceCreate],
                        db: Session = Depends(get_db),
                        _=Depends(get_user)):
    db_sentences = [
        Sentence(value=s.value, source=s.source)
        for s in sentences
    ]

    db.bulk_save_objects(db_sentences)
    db.commit()
    return {"detail": f"Added {len(sentences)} sentences"}


@router.get("", response_model=schemas.Sentence)
async def get_sentence(db: Session = Depends(get_db),
                       _=Depends(get_user)):
    sentence = db.query(Sentence) \
        .filter_by(on_review=False) \
        .filter_by(reviewed_by=None).first()

    if sentence is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No sentences available at the moment"
        )

    sentence.on_review = True
    sentence.review_timestamp = text("NOW()")
    db.commit()

    return sentence


@router.post("/reviewed")
async def mark_sentence_as_reviewed(sentence_id: int,
                                    db: Session = Depends(get_db),
                                    user: User = Depends(get_user)):
    update_query = update(Sentence) \
        .filter_by(id=sentence_id) \
        .values(on_review=False, reviewed_by=user.id)

    result = db.execute(update_query)
    row_count = result.rowcount

    if row_count > 0:
        db.commit()
        res = f"Marked sentence with id {sentence_id} as reviewed"
    else:
        res = "Invalid sentence_id, no sentence is marked as reviewed"

    return {"detail": res}


@router.get("/json", response_class=StreamingResponse)
async def get_all_annotated_sentences(by_reviewer: str = None,
                                      error_type: str = None,
                                      include_all: bool = False,
                                      today: bool = False,
                                      db: Session = Depends(get_db),
                                      _=Depends(is_admin)):
    query = db.query(Sentence)

    if include_all:
        query = query.filter(Sentence.reviewed_by.isnot(None))

        if error_type is not None:
            query = query.join(Annotation).filter(Annotation.error_type == error_type)

    else:
        query = query.join(Annotation)

        if error_type is not None:
            query = query.filter(Annotation.error_type == error_type)

    if by_reviewer is not None:
        query = query.join(Sentence.reviewer).filter(User.username == by_reviewer)

    if today is True:
        today_start = text("DATE(sentence.review_timestamp) = DATE(NOW())")
        query = query.filter(today_start)

    results = [schemas.SentenceJson.from_orm(row).dict() for row in query.all()]
    json_result = json.dumps(results, ensure_ascii=False, default=str)

    filename = "sentences_dump_" + datetime.now().strftime("%m%d%H%M") + ".json"

    return StreamingResponse(
        BytesIO(json_result.encode("utf-8")),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment;filename={filename}"}
    )


@router.put("")
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
    db.query(Sentence) \
        .filter_by(id=annotations.sentence_id) \
        .update({'reviewed_by': user.id, 'on_review': False})

    db.commit()

    return {"detail": f"Set {len(db_annotations)} annotations to sentence"}


@router.get("/{sentence_id}", response_model=schemas.SentenceFull)
async def get_sentence(sentence_id: int,
                       db: Session = Depends(get_db),
                       _=Depends(get_user)):
    sentence = crud.get(db, Sentence, id=sentence_id)

    return sentence
