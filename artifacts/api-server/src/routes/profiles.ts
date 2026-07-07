import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import {
  UpdateProfileBody,
  GetProfileResponse,
  UpdateProfileResponse,
} from "@workspace/api-zod";

const DEFAULT_PROFILE_ID = 1;

const router: IRouter = Router();

router.get("/profile", async (_req, res): Promise<void> => {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, DEFAULT_PROFILE_ID));

  if (!profile) {
    // return a default profile if none exists
    const [created] = await db
      .insert(profilesTable)
      .values({
        username: "AFGuest",
        role: "passenger",
        joinedAt: new Date().toISOString(),
        totalFlights: 0,
        memberSince: "2025",
        avatarUrl: null,
        bio: null,
      })
      .returning();

    res.json(GetProfileResponse.parse(created));
    return;
  }

  res.json(GetProfileResponse.parse(profile));
});

router.patch("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, DEFAULT_PROFILE_ID));

  if (!profile) {
    // create default profile then update
    const [created] = await db
      .insert(profilesTable)
      .values({
        username: parsed.data.username ?? "AFGuest",
        role: "passenger",
        joinedAt: new Date().toISOString(),
        totalFlights: 0,
        memberSince: "2025",
        avatarUrl: parsed.data.avatarUrl ?? null,
        bio: parsed.data.bio ?? null,
      })
      .returning();

    res.json(UpdateProfileResponse.parse(created));
    return;
  }

  const [updated] = await db
    .update(profilesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profilesTable.id, DEFAULT_PROFILE_ID))
    .returning();

  res.json(UpdateProfileResponse.parse(updated));
});

export default router;
