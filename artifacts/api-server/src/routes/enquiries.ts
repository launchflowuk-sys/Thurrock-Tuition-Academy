import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, enquiriesTable } from "@workspace/db";
import {
  CreateEnquiryBody,
  GetEnquiryParams,
  GetEnquiryResponse,
  ListEnquiriesResponse,
  UpdateEnquiryBody,
  UpdateEnquiryParams,
  UpdateEnquiryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/enquiries", async (req, res): Promise<void> => {
  const enquiries = await db.select().from(enquiriesTable).orderBy(enquiriesTable.createdAt);
  res.json(ListEnquiriesResponse.parse(enquiries.map(e => ({ ...e, createdAt: e.createdAt.toISOString() }))));
});

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [enquiry] = await db.insert(enquiriesTable).values(parsed.data).returning();
  res.status(201).json(GetEnquiryResponse.parse({ ...enquiry, createdAt: enquiry.createdAt.toISOString() }));
});

router.get("/enquiries/:id", async (req, res): Promise<void> => {
  const params = GetEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [enquiry] = await db.select().from(enquiriesTable).where(eq(enquiriesTable.id, params.data.id));
  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.json(GetEnquiryResponse.parse({ ...enquiry, createdAt: enquiry.createdAt.toISOString() }));
});

router.patch("/enquiries/:id", async (req, res): Promise<void> => {
  const params = UpdateEnquiryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [enquiry] = await db.update(enquiriesTable).set(parsed.data).where(eq(enquiriesTable.id, params.data.id)).returning();
  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.json(UpdateEnquiryResponse.parse({ ...enquiry, createdAt: enquiry.createdAt.toISOString() }));
});

export default router;
