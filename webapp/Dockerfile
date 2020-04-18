# Builder will be used to download and build all required libraries
FROM node:10 as builder 

WORKDIR /app

# Building webapp
COPY *.json ./
COPY *.ts ./
COPY package.docker.json package.json
RUN npm install
COPY ./src src
COPY ./public public
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf 
COPY --from=builder /app/build /usr/share/nginx/html