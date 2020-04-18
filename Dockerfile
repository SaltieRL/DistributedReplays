FROM python:3.6

WORKDIR /app


ADD requirements.txt .

RUN apt-get update && apt-get install -y \
    gcc \
    libfreetype6-dev \
    libpng-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

# Install Dockerize
ENV DOCKERIZE_VERSION v0.6.1
ENV DOCKERIZE_FILE dockerize-linux-amd64-${DOCKERIZE_VERSION}.tar.gz
RUN wget https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/${DOCKERIZE_FILE} \
    && tar -C /usr/local/bin -xzvf ${DOCKERIZE_FILE} \
    && rm ${DOCKERIZE_FILE}
