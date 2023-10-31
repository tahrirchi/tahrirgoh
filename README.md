# Tahrirgoh: Data Collection Platform for Grammatical Error Correction (GEC)

Tahrirgoh is a web platform developed by Tahrirchi for dataset collection for the Grammatical Error Correction (GEC) task. 

Tahrirgoh is pronounced as `T-AH-REER-GOKH`, and is made up word in Uzbek, meaning a _"place to proofread"_.

## Interface

![img.png](https://i.imgur.com/0Qstsm0.png)

## Running locally

For running the app locally, follow instructions in [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) files

## Running in production

Use the [docker-compose](docker-compose.yaml) file to run it in a production server.
Be sure to tweak the [frontend/nginx.conf](frontend/nginx.conf) file to your needs.

```bash
docker compose up -d
```

## Workflow

After you have successfully launched the platform:

1. Create worker users (API)
2. Add sentences to the platform (API)
3. Workers annotate sentences
4. Repeat steps 2 and 3 until you have enough sentences annotated
5. Download annotated sentences (API)

There is no admin panel implemented in the frontend, but there is a Swagger Docs initialized and available in the backend with user-friendly interface.
Read more about it in [API Documentation](backend/README.md#api-documentation) section on how to access it and use.


## Cite

If you use this platform during your research, please cite us.

```
@software{Mamasaidov_Tahrirgoh_is_a_2023,
author = {Mamasaidov, Mukhammadsaid and Yusupov, Jasur},
month = oct,
title = {{Tahrirgoh is a web platform for dataset collection for the Grammatical Error Correction (GEC) task.}},
url = {https://github.com/tahrirchi/tahrirgoh},
version = {1.0.0},
year = {2023}
}
```
