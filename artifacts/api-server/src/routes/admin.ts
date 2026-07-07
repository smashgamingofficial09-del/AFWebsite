import { Router, type IRouter } from "express";
import { db, flightsTable, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetAdminStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const flights = await db.select().from(flightsTable);
  const bookings = await db.select().from(bookingsTable);

  const totalFlights = flights.length;
  const totalBookings = bookings.length;
  const activePassengers = new Set(bookings.map((b) => b.passengerName)).size;
  const scheduledFlights = flights.filter((f) => f.status === "scheduled" || f.status === "boarding").length;
  const cancelledFlights = flights.filter((f) => f.status === "cancelled").length;

  // sum price * bookedSeats for each flight
  const totalRevenue = flights.reduce((acc, f) => acc + f.price * f.bookedSeats, 0);

  const stats = {
    totalFlights,
    totalBookings,
    activePassengers,
    scheduledFlights,
    cancelledFlights,
    totalRevenue,
  };

  res.json(GetAdminStatsResponse.parse(stats));
});

export default router;
