# ========== Stage 1: Base Image ========== #
# Note: zlib-sync only compiles with node<=18
FROM node:18-alpine AS base

WORKDIR /app
COPY package.json ./


# ========= Stage 2: Dependencies ========= #
FROM base AS dependencies

RUN apk update
RUN apk add --no-cache git g++ make musl-dev python3

RUN git config --global url."https://".insteadOf ssh://

COPY yarn.lock ./
RUN yarn install --production


# ============= Stage 3: Build ============ #
FROM dependencies AS build

COPY src/ src/
COPY tsconfig.json ./

RUN yarn install
RUN yarn build


# ========== Stage 4: Production ========== #
FROM base AS production

COPY --from=dependencies /app/node_modules node_modules/
COPY --from=build /app/dist dist/
COPY assets/ assets/
COPY config/ config/

CMD yarn start
