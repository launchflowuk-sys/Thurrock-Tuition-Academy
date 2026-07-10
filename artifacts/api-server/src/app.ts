import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { sessionMiddleware } from "./lib/session";
import router from "./routes";
import { logger } from "./lib/logger";

// Resolves to artifacts/thurrock-tuition/dist/public. This file always runs
// bundled from artifacts/api-server/dist/index.mjs (dev builds before
// starting too), so the path is stable relative to import.meta.dirname.
const frontendDist = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "thurrock-tuition",
  "dist",
  "public",
);

const app: Express = express();

// Required for secure session cookies to work behind Replit's production
// reverse proxy (which terminates TLS before forwarding to this server).
// Without this, Express doesn't trust X-Forwarded-Proto, so req.secure is
// always false and express-session silently drops the Set-Cookie header
// whenever cookie.secure is true.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/api", router);

app.use(express.static(frontendDist));

// SPA fallback: any unmatched GET that isn't an /api route or a real static
// file falls through to index.html so client-side routing can take over.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    next();
    return;
  }
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
