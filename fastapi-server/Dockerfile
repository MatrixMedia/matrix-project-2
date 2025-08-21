# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy environment file and source
COPY .env .
COPY . .

# Tell Docker and ECS which port the app listens on
EXPOSE 8000

# Launch Uvicorn binding to all interfaces, with 2 workers
CMD ["sh", "-c", "uvicorn app.server:app --host 0.0.0.0 --port 8000 --workers 2"]