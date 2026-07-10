import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { requireAuth, ownsStudent } from "../lib/authMiddleware";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

function sendObject(
  res: Response,
  object: { stream: NodeJS.ReadableStream; size: number; contentType: string },
  cacheControl: string,
): void {
  res.setHeader("Content-Type", object.contentType);
  res.setHeader("Content-Length", String(object.size));
  res.setHeader("Cache-Control", cacheControl);
  object.stream.pipe(res);
}

/**
 * POST /storage/uploads/request-url
 *
 * Request an upload URL for file upload.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then PUTs the file directly to the returned URL (same server, session-auth gated).
 */
router.post("/storage/uploads/request-url", requireAuth, async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const { uploadURL, objectPath } = objectStorageService.getObjectEntityUploadURL(req);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * PUT /storage/objects/uploads/:objectId
 *
 * Receives the raw file body for an objectPath previously issued by
 * request-url above, and writes it to local disk under UPLOAD_DIR.
 * NOTE: only content types other than application/json and
 * application/x-www-form-urlencoded can be streamed here — those two are
 * intercepted by the global express.json()/urlencoded() middleware in
 * app.ts before reaching this handler. Not an issue for the current
 * image-only upload flow (student photos), but would need attention if
 * this endpoint is ever used to upload files with those content types.
 */
router.put("/storage/objects/uploads/:objectId", requireAuth, async (req: Request, res: Response) => {
  try {
    const objectPath = `/objects/uploads/${req.params.objectId}`;
    const contentType = req.headers["content-type"] || "application/octet-stream";
    await objectStorageService.writeObject(objectPath, req, contentType);
    res.status(204).send();
  } catch (error) {
    req.log.error({ err: error }, "Error storing uploaded object");
    res.status(500).json({ error: "Failed to store uploaded object" });
  }
});

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from UPLOAD_DIR/public.
 * These are unconditionally public — no authentication or ACL checks.
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const object = await objectStorageService.searchPublicObject(filePath);
    if (!object) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    sendObject(res, object, "public, max-age=3600");
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/objects/*
 *
 * Serve object entities from UPLOAD_DIR/uploads. Requires authentication.
 * If the object is a student's photo, only that student's parent or an
 * admin may view it (reusing ownsStudent). Objects with no matching
 * student record fall back to "any authenticated user" — there's no other
 * owning resource to check.
 */
router.get("/storage/objects/*path", requireAuth, async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;

    const [owningStudent] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.photoUrl, objectPath));
    if (owningStudent && !(await ownsStudent(req, owningStudent.id))) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const object = await objectStorageService.getObjectEntityFile(objectPath);
    sendObject(res, object, "private, max-age=3600");
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
