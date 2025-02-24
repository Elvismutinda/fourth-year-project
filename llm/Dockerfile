# base image
FROM python:3.12-slim

# specify working directory
WORKDIR /app

# copy package list
COPY requirements.txt .

# install packages
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# install Playwright and its dependencies
RUN playwright install-deps && playwright install chromium

EXPOSE 8000

# run server
CMD ["uvicorn", "fastapi_main:app", "--host", "0.0.0.0", "--port", "8000"]
