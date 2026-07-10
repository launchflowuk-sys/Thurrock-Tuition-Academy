FROM node:24-slim AS base
WORKDIR /app
RUN corepack enable

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/thurrock-tuition/package.json artifacts/thurrock-tuition/
COPY lib ./lib
COPY scripts ./scripts
RUN pnpm install --frozen-lockfile

COPY . .
ARG BASE_PATH=/
ENV BASE_PATH=$BASE_PATH
RUN pnpm run build

EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "artifacts/api-server/dist/index.mjs"]
