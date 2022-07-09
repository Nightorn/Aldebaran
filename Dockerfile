FROM node:16-alpine

RUN apk update
RUN apk add gcc git g++ make musl-dev pkgconfig python3

WORKDIR /app

COPY package*.json ./
RUN yarn install
COPY . .

CMD npm start
