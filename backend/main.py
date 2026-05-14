import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import create_tables
from routes import auth, chat, resources

load_dotenv()

app = FastAPI(
    title="SafeGuide MX API",
    description="Backend para la plataforma SafeGuide MX de orientación en violencia de género",
    version="1.0.0",
)

_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    create_tables()


app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(resources.router)


@app.get("/")
def root():
    return {"status": "ok", "app": "SafeGuide MX API"}


@app.get("/health")
def health():
    return {"status": "healthy"}
