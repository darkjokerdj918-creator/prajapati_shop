# Use a slim Python 3.11 base image from ECR Public Mirror
FROM public.ecr.aws/docker/library/python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set working directory
WORKDIR /app


# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files to /app
COPY backend/ /app/

# Copy frontend files to /frontend (so relative path resolving in main.py works)
COPY frontend/ /frontend/

# Expose port
EXPOSE 8000

# Start Uvicorn ASGI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
