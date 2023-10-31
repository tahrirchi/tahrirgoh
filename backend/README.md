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

## API Documentation

Access Swagger Docs at: `<BASE_URL>/api/docs`  _(BASE_URL from .env file)_

![img.png](https://i.imgur.com/1XgRJMa.png)

Initially there is only one user which is admin user with `username` and `password` defined in `.env` file.
```dotenv
ADMIN_USERNAME='your_admin_username'
ADMIN_PASSWORD='your_admin_password'
```

Only admin user have access to these endpoints:
- `/user/create` - creating new users in the system
- `/user/paid` - adding paid amount (the amount will be subtracted when calculating users' earned credits)
- `/sentence/json` - getting sentences with their annotations in json file

You can make requests through Swagger Docs directly (use it as an admin panel), first you need to authorize your user by clicking on the green **Authorize** button (top right) and entering your username and password.
