FROM node:19-alpine

# Preparing the distribution
RUN apk update
RUN apk add gcc git g++ make musl-dev pkgconfig python3

# Let the fun begin
WORKDIR /app

# Dependencies installation
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Compiling TS code
COPY tsconfig.json ./
RUN tsc

# Copying files
COPY assets/ assets/
COPY config/ config/
COPY src/ src/

# Running Aldebaran
CMD npm start
