import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, flightsTable } from "@workspace/db";
import {
  GetBookingParams,
  CancelBookingParams,
  CreateBookingBody,
  CreateBookingResponse,
  GetBookingResponse,
  CancelBookingResponse,
  ListBookingsResponse,
  ListAllBookingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings", async (_req, res): Promise<void> => {
  const bookings = await db
    .select({
      id: bookingsTable.id,
      flightId: bookingsTable.flightId,
      passengerName: bookingsTable.passengerName,
      seatClass: bookingsTable.seatClass,
      status: bookingsTable.status,
      createdAt: bookingsTable.createdAt,
      flight: {
        id: flightsTable.id,
        flightNumber: flightsTable.flightNumber,
        origin: flightsTable.origin,
        destination: flightsTable.destination,
        departureTime: flightsTable.departureTime,
        arrivalTime: flightsTable.arrivalTime,
        aircraft: flightsTable.aircraft,
        status: flightsTable.status,
        seats: flightsTable.seats,
        bookedSeats: flightsTable.bookedSeats,
        price: flightsTable.price,
        imageUrl: flightsTable.imageUrl,
      },
    })
    .from(bookingsTable)
    .leftJoin(flightsTable, eq(bookingsTable.flightId, flightsTable.id))
    .orderBy(bookingsTable.createdAt);

  const mapped = bookings.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    flight: b.flight
      ? {
          ...b.flight,
          imageUrl: b.flight.imageUrl ?? null,
        }
      : undefined,
  }));

  res.json(ListBookingsResponse.parse(mapped));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // check flight exists
  const [flight] = await db
    .select()
    .from(flightsTable)
    .where(eq(flightsTable.id, parsed.data.flightId));

  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      flightId: parsed.data.flightId,
      passengerName: parsed.data.passengerName,
      seatClass: parsed.data.seatClass,
      status: "confirmed",
    })
    .returning();

  // increment bookedSeats
  await db
    .update(flightsTable)
    .set({ bookedSeats: flight.bookedSeats + 1 })
    .where(eq(flightsTable.id, flight.id));

  const result = {
    ...booking,
    createdAt: booking.createdAt.toISOString(),
    flight: { ...flight, imageUrl: flight.imageUrl ?? null },
  };

  res.status(201).json(CreateBookingResponse.parse(result));
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select({
      id: bookingsTable.id,
      flightId: bookingsTable.flightId,
      passengerName: bookingsTable.passengerName,
      seatClass: bookingsTable.seatClass,
      status: bookingsTable.status,
      createdAt: bookingsTable.createdAt,
      flight: {
        id: flightsTable.id,
        flightNumber: flightsTable.flightNumber,
        origin: flightsTable.origin,
        destination: flightsTable.destination,
        departureTime: flightsTable.departureTime,
        arrivalTime: flightsTable.arrivalTime,
        aircraft: flightsTable.aircraft,
        status: flightsTable.status,
        seats: flightsTable.seats,
        bookedSeats: flightsTable.bookedSeats,
        price: flightsTable.price,
        imageUrl: flightsTable.imageUrl,
      },
    })
    .from(bookingsTable)
    .leftJoin(flightsTable, eq(bookingsTable.flightId, flightsTable.id))
    .where(eq(bookingsTable.id, params.data.id));

  const row = rows[0];
  if (!row) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const result = {
    ...row,
    createdAt: row.createdAt.toISOString(),
    flight: row.flight ? { ...row.flight, imageUrl: row.flight.imageUrl ?? null } : undefined,
  };

  res.json(GetBookingResponse.parse(result));
});

router.delete("/bookings/:id", async (req, res): Promise<void> => {
  const params = CancelBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .update(bookingsTable)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const result = {
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  };

  res.json(CancelBookingResponse.parse(result));
});

router.get("/admin/bookings", async (_req, res): Promise<void> => {
  const bookings = await db
    .select({
      id: bookingsTable.id,
      flightId: bookingsTable.flightId,
      passengerName: bookingsTable.passengerName,
      seatClass: bookingsTable.seatClass,
      status: bookingsTable.status,
      createdAt: bookingsTable.createdAt,
      flight: {
        id: flightsTable.id,
        flightNumber: flightsTable.flightNumber,
        origin: flightsTable.origin,
        destination: flightsTable.destination,
        departureTime: flightsTable.departureTime,
        arrivalTime: flightsTable.arrivalTime,
        aircraft: flightsTable.aircraft,
        status: flightsTable.status,
        seats: flightsTable.seats,
        bookedSeats: flightsTable.bookedSeats,
        price: flightsTable.price,
        imageUrl: flightsTable.imageUrl,
      },
    })
    .from(bookingsTable)
    .leftJoin(flightsTable, eq(bookingsTable.flightId, flightsTable.id))
    .orderBy(bookingsTable.createdAt);

  const mapped = bookings.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    flight: b.flight ? { ...b.flight, imageUrl: b.flight.imageUrl ?? null } : undefined,
  }));

  res.json(ListAllBookingsResponse.parse(mapped));
});

export default router;
