# ---------------------------------------------------------------------------
# Build stage — needs the full source tree, devDependencies and the toolchain.
# ---------------------------------------------------------------------------
FROM node:24-slim AS build
WORKDIR /app
RUN corepack enable

# Manifests first so the dependency layer is cached across source-only changes.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY artifacts/api-server/package.json artifacts/api-server/
COPY artifacts/thurrock-tuition/package.json artifacts/thurrock-tuition/
COPY lib/api-client-react/package.json lib/api-client-react/
COPY lib/api-spec/package.json lib/api-spec/
COPY lib/api-zod/package.json lib/api-zod/
COPY lib/db/package.json lib/db/
COPY scripts/package.json scripts/
RUN pnpm install --frozen-lockfile

COPY . .

ARG BASE_PATH=/
ENV BASE_PATH=$BASE_PATH
# Only used to satisfy the frontend's vite.config.ts, which requires PORT at
# build time. The runtime port is set separately in the final stage.
ARG PORT=8080
ENV PORT=$PORT
RUN pnpm run build

# Produce a self-contained node_modules for the API server alone, holding only
# its production dependencies. `pnpm prune --prod` is NOT usable here: run at
# the workspace root it evaluates the root package (which has no dependencies)
# and empties every workspace package's node_modules, leaving the bundle unable
# to resolve `nodemailer` at boot.
#
# nodemailer is the one `external` in build.mjs that the server actually
# imports; everything else esbuild inlines into dist/index.mjs.
RUN CI=true pnpm --filter @workspace/api-server deploy --prod --legacy /deploy

# ---------------------------------------------------------------------------
# Runtime stage — the built API bundle, the built frontend, and prod deps only.
# ---------------------------------------------------------------------------
FROM node:24-slim AS runtime
WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production
ENV PORT=8080
ENV UPLOAD_DIR=/data/uploads

# The API bundle plus the frontend build it serves (app.ts resolves the
# frontend at ../../thurrock-tuition/dist/public relative to its own dist/).
COPY --from=build /deploy/dist ./artifacts/api-server/dist
COPY --from=build /app/artifacts/thurrock-tuition/dist ./artifacts/thurrock-tuition/dist

# The self-contained tree from `pnpm deploy` — real directories, not symlinks
# into a store that doesn't exist in this stage. Laid down at the api-server's
# own path so Node resolves `nodemailer` from dist/index.mjs's own directory.
COPY --from=build /deploy/node_modules ./artifacts/api-server/node_modules
COPY --from=build /deploy/package.json ./artifacts/api-server/package.json

# Schema/session migrations and admin creation are run from outside the
# container (they need drizzle-kit and tsx, which are devDependencies):
#   pnpm --filter @workspace/db run migrate
#   pnpm --filter @workspace/db run push
#   pnpm --filter @workspace/db run create-admin <email> <password> "<name>"

# UPLOAD_DIR must be a persistent Coolify volume mounted at /data — without it
# every uploaded student photo is lost on the next redeploy. Created and chowned
# here so the container still starts (writing to ephemeral storage) if the
# volume is missing, rather than failing on the first upload.
RUN mkdir -p /data/uploads && chown -R node:node /data
VOLUME ["/data"]

# gosu lets the entrypoint drop privileges by exec, so PID 1 remains node and
# Coolify's SIGTERM reaches the graceful-shutdown handler.
RUN apt-get update   && apt-get install -y --no-install-recommends gosu   && rm -rf /var/lib/apt/lists/*

# NOTE: deliberately no `USER node` here. The entrypoint starts as root purely
# to chown the mounted upload volume — which Coolify created root-owned, since
# every previous release ran as root — and then execs as node. Setting USER
# here instead would leave uploads failing with EACCES against that volume.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 8080

# /api/healthz is a plain 200 JSON endpoint (routes/health.ts). Point Coolify's
# health check at it too — this HEALTHCHECK only covers `docker run` directly.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/api/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
