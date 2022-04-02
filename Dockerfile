FROM node:16-alpine

RUN apk update
RUN apk add gcc git g++ make musl-dev pkgconfig python3

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV WAIT_VERSION 2.9.0
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD /wait && npm start