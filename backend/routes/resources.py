import json
import os
from fastapi import APIRouter

router = APIRouter(prefix="/resources", tags=["resources"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "resources.json")


def load_resources():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("")
def get_resources(city: str | None = None, type: str | None = None):
    resources = load_resources()

    if city:
        city_lower = city.lower().strip()
        resources = [
            r for r in resources
            if city_lower in r.get("city", "").lower()
        ]

    if type:
        resources = [r for r in resources if r.get("type") == type]

    return resources
