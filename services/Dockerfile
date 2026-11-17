FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev=false

COPY tsconfig.json ./
COPY protos ./protos
COPY sql ./sql
COPY src ./src

ENV NODE_ENV=production
CMD ["npx", "tsx", "src/bff/server.ts"]
