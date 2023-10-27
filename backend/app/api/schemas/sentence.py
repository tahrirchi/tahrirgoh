import datetime
from typing import List
from pydantic import BaseModel

from .user import Reviewer
from .annotation import Annotation


__all__ = (
    'Sentence',
    'SentenceCreate',
    'SentenceJson',
    'SentenceFull'
)


class SentenceCreate(BaseModel):
    value: str
    source: str


class Sentence(BaseModel):
    id: int
    value: str
    source: str
    annotations: List[Annotation] = None

    class Config:
        orm_mode = True


class SentenceJson(BaseModel):
    id: int
    value: str
    source: str

    review_timestamp: datetime.datetime
    reviewer: Reviewer = None

    annotations: List[Annotation] = None

    class Config:
        orm_mode = True


class SentenceFull(SentenceJson):
    on_review: bool
