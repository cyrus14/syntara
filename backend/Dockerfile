FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
  cmake \
  protobuf-compiler \
  libprotoc-dev \
  gcc \
  g++ \
  git \
  && apt-get clean

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --prefer-binary -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "api.py"]
