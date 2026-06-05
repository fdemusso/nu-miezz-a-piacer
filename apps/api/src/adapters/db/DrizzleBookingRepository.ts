import { eq, and, notInArray } from 'drizzle-orm';
import { IBookingRepository, Booking, BookingStatus } from '@mvp/contracts';
import { Db } from '../../db';
import { bookings } from '../../db/schema';

const INACTIVE_STATUSES: BookingStatus[] = [
  BookingStatus.CANCELLED,
  BookingStatus.EXPIRED,
  BookingStatus.COMPLETED,
  BookingStatus.CONVERTED_TO_RIDE,
];

function rowToBooking(row: typeof bookings.$inferSelect): Booking {
  return {
    id: row.id,
    userId: row.userId,
    vehicleId: row.vehicleId,
    status: row.status as BookingStatus,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt,
    confirmedAt: row.confirmedAt ?? undefined,
    cancelledAt: row.cancelledAt ?? undefined,
  };
}

export class DrizzleBookingRepository implements IBookingRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<Booking | null> {
    const rows = await this.db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async findActiveByUserId(userId: string): Promise<Booking | null> {
    const rows = await this.db
      .select()
      .from(bookings)
      .where(and(eq(bookings.userId, userId), notInArray(bookings.status, INACTIVE_STATUSES)))
      .limit(1);
    return rows[0] ? rowToBooking(rows[0]) : null;
  }

  async create(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const id = crypto.randomUUID();
    const now = new Date();
    await this.db.insert(bookings).values({
      id,
      userId: data.userId,
      vehicleId: data.vehicleId,
      status: data.status,
      createdAt: now,
      expiresAt: data.expiresAt,
      confirmedAt: data.confirmedAt ?? null,
      cancelledAt: data.cancelledAt ?? null,
    });
    return { id, createdAt: now, ...data };
  }

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await this.db.update(bookings).set({ status }).where(eq(bookings.id, id));
  }
}
