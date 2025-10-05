#!/usr/bin/env python3
"""
FastAPI application entry point for Weather Probability Dashboard
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from quadcode.app.api.v1.weather import router as weather_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Weather Probability Dashboard API",
    description="API for querying historical weather data and probabilities from NASA Earthdata",
    version="1.0.0"
)

# Configure CORS for frontend
allowed_origins = [
    "http://localhost:3000",  # Local Next.js dev
    "http://localhost:5173",  # Local Vite dev
    "https://quadcode-frontend.onrender.com", 
]

# Add production frontend URL if set
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weather_router, prefix="/api/v1/weather", tags=["weather"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Weather Probability Dashboard API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
