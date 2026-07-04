import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { sessionMiddleware } from "./lib/session";
import router from "./routes";
import { logger } from "./lib/logger";

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

export default app;
