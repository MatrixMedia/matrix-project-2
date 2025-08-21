import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi import status
from contextlib import asynccontextmanager
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.limiter import limiter
# from app.graph import FelpAgent
from app.agent_manager import AgentManager
# from .routes import search_routes

logging.basicConfig(level=logging.INFO) 
logger = logging.getLogger(__name__)

logger.info("Starting FastAPI application")



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    try:
        atlas_uri = os.getenv("ATLAS_URI")
        mongo_db  = os.getenv("MONGO_DB", "felp-ai-db")

        if not atlas_uri:
            raise RuntimeError("ATLAS_URI is not set in environment")

        client = AsyncIOMotorClient(atlas_uri)
        app.state.mongodb_client = client
        app.state.mongodb        = client[mongo_db]
        logger.info("MongoDB connected to %s at startup", mongo_db)

        logger.info("Server Started.")
        # logger.info("Pre-initializing chatbots for domains %s", KNOWN_DOMAINS)
        # app.state.chatbots = chatbots
        app.state.agent_manager = await AgentManager.create()
        if app.state.agent_manager and app.state.agent_manager.s3_client:
            await app.state.agent_manager.s3_client.__aexit__(None, None, None)
        logger.info("Chatbots initiallized")

    except Exception as e:
        logger.error(f"Database connection failed at startup: {e}")

    yield  # app runs here

    try:
        app.state.mongodb_client.close()
        logger.info("MongoDB connection closed.")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

    # Shutdown code (optional)
    logger.info("Shutting down FastAPI app.")

app = FastAPI(lifespan=lifespan)

async def get_db() -> AsyncIOMotorDatabase:
    """
    Dependency for pulling the Mongo database from app.state.
    Usage in a router: db: AsyncIOMotorDatabase = Depends(get_db)
    """
    return app.state.mongodb

async def _rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An unexpected error occurred."},
    )

from .routes import search_routes #### DO NOT REMOVE THIS IMPORT FROM HERE ITS TO RESOLVE A CIRCULAR DEPENDENCY
# Include routers
app.include_router(search_routes.router, prefix="/ai", tags=["Search"])

@app.get("/")
def root():
    return {"message": "Felp AI API is up and running"}
