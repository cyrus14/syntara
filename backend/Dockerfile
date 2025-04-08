# Use a slim Python image with Debian for package support
FROM python:3.11-slim

# Install system dependencies needed for ONNX
RUN apt-get update && apt-get install -y \
  cmake \
  protobuf-compiler \
  libprotoc-dev \
  gcc \
  g++ \
  git \
  && apt-get clean

# Set working directory
WORKDIR /app

# Copy dependency list and install Python packages
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the backend source code
COPY . .

# Expose the port your Flask app will use
EXPOSE 8000

# Run your Flask app
CMD ["python", "api.py"]
