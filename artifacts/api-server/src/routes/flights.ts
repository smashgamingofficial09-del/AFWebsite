import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, flightsTable } from "@workspace/db";
import {
  GetFlightParams,
  ListFlightsResponse,
  GetFlightResponse,
  CreateFlightBody,
  CreateFlightResponse,
  UpdateFlightParams,
  UpdateFlightBody,
  UpdateFlightResponse,
  DeleteFlightParams,
  DeleteFlightResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/flights", async (_req, res): Promise<void> => {
  const flights = await db.select().from(flightsTable).orderBy(flightsTable.departureTime);
  res.json(ListFlightsResponse.parse(flights));
});

router.get("/flights/:id", async (req, res): Promise<void> => {
  const params = GetFlightParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [flight] = await db.select().from(flightsTable).where(eq(flightsTable.id, params.data.id));
  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  res.json(GetFlightResponse.parse(flight));
});

router.post("/admin/flights", async (req, res): Promise<void> => {
  const parsed = CreateFlightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [flight] = await db.insert(flightsTable).values(parsed.data).returning();
  res.status(201).json(CreateFlightResponse.parse(flight));
});

router.patch("/admin/flights/:id", async (req, res): Promise<void> => {
  const params = UpdateFlightParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateFlightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [flight] = await db
    .update(flightsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(flightsTable.id, params.data.id))
    .returning();

  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  res.json(UpdateFlightResponse.parse(flight));
});

router.delete("/admin/flights/:id", async (req, res): Promise<void> => {
  const params = DeleteFlightParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [flight] = await db
    .delete(flightsTable)
    .where(eq(flightsTable.id, params.data.id))
    .returning();

  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  res.json(DeleteFlightResponse.parse(flight));
});

export default router;
