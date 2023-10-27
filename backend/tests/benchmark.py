import random
import string
import requests
from typing import Union
from loguru import logger

from app.core.config import settings


def gen_number(start: int = 0, end: int = 10000) -> int:
    return random.randint(start, end)

def gen_string(length: int = 10) -> str:
    return ''.join(random.choice(string.ascii_letters) for _ in range(length))

def get_comma(chance: float = 0.10) -> str:
    assert 0 <= chance <= 1
    op_chance = 1 - chance
    return random.choices([',', ''], weights=[chance, op_chance])[0]

def gen_sentence(words: int = 10):
    return ' '.join(gen_string() + get_comma() for _ in range(words)) + "."


def get_random_error_type():
    e_types = ["Spelling", "Punctuation", f"G/{gen_string(5).title()}", f"F/{gen_string(5).title()}"]
    return random.choice(e_types)


def gen_annotation():
    i = gen_number()
    return {
        "from_index": i,
        "to_index": i + gen_number(5, 25),
        "new_value": gen_string(),
        "old_value": gen_string(),
        "error_type": get_random_error_type()
    }

def gen_sentences(n: int = 100):
    return [
        {
            "value": gen_sentence(),
            "source": gen_string()
        }
        for _ in range(n)
    ]


class ApiRequester:

    def __init__(self):
        self.url = settings.BASE_URL + "/api"

        response = requests.post(
            self.url + "/user/authorize",
            json={
                "username": settings.ADMIN_USERNAME,
                "password": settings.ADMIN_PASSWORD
            }
        )

        self.token = response.json()["access_token"]

        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.token}"
        })

    def get(self, endpoint: str, params=None) -> requests.Response:
        return self.session.get(self.url + endpoint, params=params)

    def post(self, endpoint: str, data: Union[dict, list]) -> requests.Response:
        return self.session.post(self.url + endpoint, json=data)

    def add_sentences(self, n: int = 100) -> requests.Response:
        # logger.info(f"Generating {n} sentences...")
        sentences = gen_sentences(n)
        logger.info(f"Generated {n} sentences!")
        return self.post("/sentence", data=sentences)

    def add_annotations(self, sentence_id: int, n: int = 100) -> requests.Response:
        # logger.info(f"Generating {n} annotations...")
        annotations = [gen_annotation() for _ in range(n)]
        logger.info(f"Generated {n} annotations")

        return self.post("/annotation", data={
            "sentence_id": sentence_id,
            "annotations": annotations
        })

    def get_sentence(self) -> requests.Response:
        return self.get("/sentence")

    def get_user_report(self) -> requests.Response:
        return self.get("/user/report", params={"username": settings.ADMIN_USERNAME})

def main():
    logger.info("Authenticating...")
    r = ApiRequester()
    logger.info("Authenticated!")

    logger.info("Adding 10K sentences...")
    r.add_sentences(10_000)
    logger.info("Added 10K sentences!")

    logger.info("Adding 10 annotations to each sentence...")
    sentence = r.get_sentence()
    while sentence.status_code == 200:
        r.add_annotations(sentence.json()["id"], 10)
        logger.info(f"Added 10 annotations to sentence {sentence.json()['id']}")
        sentence = r.get_sentence()

    logger.info("Added 10 annotations to each sentence!")

    logger.info("Getting user report...")
    report = r.get_user_report()
    if report.status_code == 200:
        print(report.json())
    logger.info("Got user report!")

    logger.info("Benchmark finished!")


if __name__ == '__main__':
    main()
