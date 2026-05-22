from fastapi import APIRouter
from services.prediction import predict_crowd

router = APIRouter()

buses = [
    {"id": 1, "name": "Bus 201", "lat": 12.9716, "lng": 77.5946},
    {"id": 2, "name": "Bus 205", "lat": 12.9750, "lng": 77.5990},
]

@router.get("/buses")
def get_buses():
    result = []
    for bus in buses:
        crowd = predict_crowd()
        result.append({**bus, "crowd": crowd})
    return result


@router.get("/recommend")
def recommend_bus():
    result = []
    for bus in buses:
        crowd = predict_crowd()
        result.append({**bus, "crowd": crowd})

    best = next((b for b in result if b["crowd"] != "High"), result[0])

    return {"recommended": best, "all": result}