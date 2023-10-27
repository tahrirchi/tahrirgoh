from jose import jwt as _jwt
from typing import Union, Any
from pydantic import ValidationError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException, status

from app.core.config import settings
from app.api.schemas import TokenPayload


pass_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


class JWT:
    ACCESS_TOKEN_EXPIRE_MINUTES = 525960   # 1 year
    ALGORITHM = "HS256"

    @classmethod
    def _create(cls, key: str, expire_minutes: int, subject: Union[str, Any]) -> str:
        expires_delta = datetime.utcnow() + timedelta(minutes=expire_minutes)
        to_encode = {"exp": expires_delta, "sub": subject}
        return _jwt.encode(to_encode, key, cls.ALGORITHM)

    @classmethod
    def _decode(cls, token, secret_key):
        try:
            payload = _jwt.decode(token, secret_key, algorithms=[cls.ALGORITHM])
            token_data = TokenPayload(**payload)

            if datetime.fromtimestamp(token_data.exp) < datetime.now():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        except (_jwt.JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return token_data

    @classmethod
    def create_access_token(cls, subject: Union[str, Any]) -> str:
        return cls._create(settings.JWT_KEY, cls.ACCESS_TOKEN_EXPIRE_MINUTES, subject)

    @classmethod
    def decode_access_token(cls, token: str):
        return cls()._decode(token, settings.JWT_KEY)


def test() -> None:
    token = JWT.create_access_token("test")
    print("token:", token)
    res = JWT.decode_access_token(token)
    print("res:", res)


if __name__ == '__main__':
    test()
