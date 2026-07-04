import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";

const PgSession = connectPgSimple(session);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set.");
}

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "user_sessions",
    // The table is created via a one-off migration (see lib/db). We do NOT
    // rely on createTableIfMissing: connect-pg-simple reads its schema from
    // an on-disk table.sql file that esbuild does not bundle, so it fails
    // at runtime in the built server (ENOENT).
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "tta.sid",
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
});

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: string;
  }
}
