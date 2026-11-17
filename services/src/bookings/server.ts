import { PORTS } from "../shared/config.js";
import { query } from "../shared/db.js";
import { bookingRowToGrpc } from "../shared/mappers.js";
import { grpc, loadPackage, startServer } from "../shared/grpc.js";

const pkg = loadPackage("lumi/v1/bookings.proto");
const service = pkg.lumi.v1.BookingsService.service;

const SLOT_TIMES = [
  "10:00",
  "11:00",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
];

function buildAvailability(date: string, bookedTimes: Set<string>) {
  const daySeed = date.split("-").reduce((acc, part) => acc + Number(part), 0);
  return SLOT_TIMES.map((time, index) => {
    const patternOpen = (daySeed + index) % 4 !== 0;
    return {
      time,
      available: patternOpen && !bookedTimes.has(time),
    };
  });
}

async function listSlots(call: any, callback: any) {
  try {
    const date = call.request.date;
    if (!date) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "date is required (YYYY-MM-DD)",
      });
      return;
    }
    const { rows } = await query<{ time: string }>(
      `SELECT time FROM bookings WHERE date = $1 AND status <> 'cancelled'`,
      [date],
    );
    const booked = new Set(rows.map((r) => r.time));
    callback(null, { slots: buildAvailability(date, booked) });
  } catch (err) {
    callback(err);
  }
}

async function createBooking(call: any, callback: any) {
  try {
    const req = call.request;
    if (!req.serviceId || !req.date || !req.time || !req.name || !req.phone) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "serviceId, date, time, name, and phone are required",
      });
      return;
    }

    const id = `bk_${Date.now().toString(36)}`;
    const designId = req.designId || null;
    const { rows } = await query(
      `INSERT INTO bookings (id, service_id, design_id, date, time, name, phone, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
       RETURNING *`,
      [
        id,
        req.serviceId,
        designId,
        req.date,
        req.time,
        req.name,
        req.phone,
        req.notes || "",
      ],
    );
    callback(null, bookingRowToGrpc(rows[0]));
  } catch (err) {
    callback(err);
  }
}

async function getBooking(call: any, callback: any) {
  try {
    const { rows } = await query(`SELECT * FROM bookings WHERE id = $1`, [
      call.request.id,
    ]);
    if (!rows[0]) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Booking ${call.request.id} not found`,
      });
      return;
    }
    callback(null, bookingRowToGrpc(rows[0]));
  } catch (err) {
    callback(err);
  }
}

startServer("bookings", PORTS.bookings, (server) => {
  server.addService(service, {
    listSlots,
    createBooking,
    getBooking,
  });
});
