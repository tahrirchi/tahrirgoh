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

## Cite

If you use this platform during your reserach, please cite us.

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
