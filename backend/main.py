from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.bus_routes import router as bus_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bus_router)

@app.get("/")
def home():
    return {"message": "TransitSense Backend Running"}