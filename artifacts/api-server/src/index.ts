import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Note: the listen() callback takes no arguments — listen errors arrive as an
// "error" event on the server, and without a listener Node rethrows them as an
// uncaught exception with no useful log line.
const server = app.listen(port, () => {
  logger.info({ port }, "Server listening");
});

server.on("error", (err) => {
  logger.error({ err, port }, "Server failed to listen");
  process.exit(1);
});

// Coolify sends SIGTERM on redeploy; finish in-flight requests before exiting
// so a deploy doesn't drop a payment webhook mid-write.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    logger.info({ signal }, "Shutting down");
    server.close(() => process.exit(0));
    // Don't hang forever on a stuck keep-alive connection.
    setTimeout(() => process.exit(0), 10_000).unref();
  });
}
