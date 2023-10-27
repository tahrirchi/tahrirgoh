from typing import List
from pydantic import BaseModel

__all__ = (
    'Annotation',
    'AnnotationCreate',
    'AnnotationCreateBatch'
)


class Annotation(BaseModel):
    from_index: int
    to_index: int
    new_value: str
    old_value: str
    error_type: str = None

    class Config:
        orm_mode = True


class AnnotationCreate(BaseModel):
    sentence_id: int
    from_index: int
    to_index: int
    new_value: str
    old_value: str
    error_type: str = None


class AnnotationBatch(BaseModel):
    from_index: int
    to_index: int
    new_value: str
    old_value: str
    error_type: str = None


class AnnotationCreateBatch(BaseModel):
    sentence_id: int
    annotations: List[AnnotationBatch]
