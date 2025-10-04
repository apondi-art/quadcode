# Backend Dockerfile for FastAPI application
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for scientific Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    gfortran \
    libproj-dev \
    libgeos-dev \
    libhdf5-dev \
    libnetcdf-dev \
    libgdal-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry==1.7.1

# Copy Poetry files
COPY backend/pyproject.toml backend/poetry.lock ./

# Configure Poetry to not create a virtual environment
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-root --no-dev

# Copy application code
COPY backend/ .

# Install the package itself
RUN poetry install --no-interaction --no-ansi --only-root

# Expose port
EXPOSE 8000

# Set Python path
ENV PYTHONPATH=/app

# Run the application
CMD ["python", "-m", "uvicorn", "quadcode.main:app", "--host", "0.0.0.0", "--port", "8000"]
