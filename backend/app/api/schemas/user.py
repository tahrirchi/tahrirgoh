from pydantic import BaseModel


__all__ = (
    'UserData',
    'TokenPayload',
    'TokenResponse',
    'Reviewer',
    'ErrorTypeCount',
    'UserReport',
    'PaidAmount',
    'PaidAmountResponse'
)


class UserData(BaseModel):
    username: str
    password: str


class TokenPayload(BaseModel):
    sub: str
    exp: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class Reviewer(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True


class ErrorTypeCount(BaseModel):
    spelling: int
    punctuation: int
    grammar: int
    fluency: int


class UserReport(BaseModel):
    username: str
    annotations_added: int
    only_reviewed: int
    total_reviewed: int
    calculated_score: int
    error_type_count: ErrorTypeCount

class PaidAmount(BaseModel):
    username: str
    amount: int

class PaidAmountResponse(BaseModel):
    username: str
    paid_amount: int

    class Config:
        orm_mode = True
