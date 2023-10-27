# Tahrirgoh Backend

This README file contains instructions on how to run the backend locally.
For running it in production server together with its frontend see [deployment](../README.md) instructions.


## Prerequisites

Prepare `.env` file from `.env.example` and fill it with your own values.

**This action is required for both running locally and in production.*

## Run

### Docker

#### Requirements
- Docker

```bash
docker-compose up
```

### Local machine

#### Requirements
- Python 3.10 (should work with other versions, not tested)
- PostgreSQL database

It's recommended to create separate python virtual environment for this project.

Install dependencies:
```bash
pip install -r requirements.txt
```

Apply migrations and run the server:
```bash
alembic upgrade head; uvicorn app.main:app --proxy-headers --host 0.0.0.0 --port 8000 --reload
```

Swagger Docs: http://localhost:8000/api/docs


