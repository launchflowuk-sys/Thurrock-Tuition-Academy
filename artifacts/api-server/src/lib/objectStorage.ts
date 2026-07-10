import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import type { Request } from "express";

// Local filesystem replacement for the old Replit-sidecar-backed GCS storage.
// UPLOAD_DIR must be a persistent volume in production (see CLAUDE.md) — if
// it's left as regular container storage, every upload is lost on redeploy.
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/data/uploads";
const PRIVATE_DIR = path.join(UPLOAD_DIR, "uploads");
const PUBLIC_DIR = path.join(UPLOAD_DIR, "public");

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

interface StoredObjectMeta {
  contentType: string;
}

interface StoredObject {
  stream: NodeJS.ReadableStream;
  size: number;
  contentType: string;
}

function metaPath(filePath: string): string {
  return `${filePath}.meta.json`;
}

// Resolves a client-facing "/objects/uploads/<id>" path to an absolute path
// under PRIVATE_DIR, rejecting anything that would resolve outside it.
function resolvePrivateFile(objectPath: string): string {
  const prefix = "/objects/uploads/";
  if (!objectPath.startsWith(prefix)) {
    throw new ObjectNotFoundError();
  }
  return resolveWithinBase(PRIVATE_DIR, objectPath.slice(prefix.length));
}

function resolvePublicFile(filePath: string): string {
  return resolveWithinBase(PUBLIC_DIR, filePath);
}

function resolveWithinBase(baseDir: string, relativePath: string): string {
  const resolved = path.resolve(baseDir, relativePath);
  if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
    throw new ObjectNotFoundError();
  }
  return resolved;
}

async function readMeta(filePath: string): Promise<string> {
  try {
    const raw = await readFile(metaPath(filePath), "utf-8");
    const parsed = JSON.parse(raw) as StoredObjectMeta;
    return parsed.contentType || "application/octet-stream";
  } catch {
    return "application/octet-stream";
  }
}

export class ObjectStorageService {
  // Returns a same-origin URL the client can PUT the raw file bytes to,
  // plus the objectPath to persist on the owning record and use for later
  // GETs. No signing needed — the route itself is auth-gated.
  getObjectEntityUploadURL(req: Request): { uploadURL: string; objectPath: string } {
    const objectId = randomUUID();
    const objectPath = `/objects/uploads/${objectId}`;
    const uploadURL = `${req.protocol}://${req.get("host")}/api/storage${objectPath}`;
    return { uploadURL, objectPath };
  }

  async writeObject(
    objectPath: string,
    body: NodeJS.ReadableStream,
    contentType: string,
  ): Promise<void> {
    const filePath = resolvePrivateFile(objectPath);
    await mkdir(path.dirname(filePath), { recursive: true });
    try {
      await pipeline(body, createWriteStream(filePath));
      await writeFile(metaPath(filePath), JSON.stringify({ contentType } satisfies StoredObjectMeta));
    } catch (err) {
      await unlink(filePath).catch(() => {});
      throw err;
    }
  }

  async getObjectEntityFile(objectPath: string): Promise<StoredObject> {
    const filePath = resolvePrivateFile(objectPath);
    let stats;
    try {
      stats = await stat(filePath);
    } catch {
      throw new ObjectNotFoundError();
    }
    return {
      stream: createReadStream(filePath),
      size: stats.size,
      contentType: await readMeta(filePath),
    };
  }

  async searchPublicObject(filePath: string): Promise<StoredObject | null> {
    let resolved: string;
    try {
      resolved = resolvePublicFile(filePath);
    } catch {
      return null;
    }
    try {
      const stats = await stat(resolved);
      return {
        stream: createReadStream(resolved),
        size: stats.size,
        contentType: await readMeta(resolved),
      };
    } catch {
      return null;
    }
  }
}
