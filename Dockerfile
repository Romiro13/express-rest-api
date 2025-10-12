FROM node:24-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl \
  && npm install -g pnpm \
  && apt-get clean

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm i

COPY . .

# RUN pnpx prisma generate

CMD [ "pnpm", "dev" ]
