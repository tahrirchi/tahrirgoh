# DOCKERFILE FOR BACKEND DEVELOPMENT

FROM python:3.10-slim-bullseye

WORKDIR code/

ENV PYTHONUNBUFFERED=1

RUN python -m pip install --upgrade pip setuptools wheel

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY . ./

COPY .env .

CMD ["sh", "-c", "alembic upgrade head ; uvicorn app.main:app --proxy-headers --host 0.0.0.0 --port 8000 --reload"]
