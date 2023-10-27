from os import path
from typing import List
from pydantic import BaseSettings


class _Settings(BaseSettings):
    PROJECT_NAME: str
    BASE_URL: str
    DATABASE_URI: str
    JWT_KEY: str
    BACKEND_CORS_ORIGINS: List[str] = []

    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str

    class Config:
        env_file = path.join(path.dirname(__file__).rsplit(path.sep, 2)[0], ".env")
        env_file_encoding = 'utf-8'
        case_sensitive = True


settings = _Settings()

if __name__ == '__main__':
    print(settings)
