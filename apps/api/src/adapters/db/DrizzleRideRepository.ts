import { eq } from 'drizzle-orm';
import { IRideRepository, Ride, RideStatus } from '@mvp/contracts';
import { Db } from '../../db';
import { rides } from '../../db/schema';

function rowToRide(row: typeof rides.$inferSelect): Ride {
  return {
    id: row.id,
    userId: row.userId,
    vehicleId: row.vehicleId,
    bookingId: row.bookingId ?? undefined,
    status: row.status as RideStatus,
    startedAt: row.startedAt,
    endedAt: row.endedAt ?? undefined,
    startLocation: { lat: row.startLat, lng: row.startLng },
    endLocation: row.endLat != null && row.endLng != null ? { lat: row.endLat, lng: row.endLng } : undefined,
    distanceKm: row.distanceKm ?? undefined,
    durationMinutes: row.durationMinutes ?? undefined,
    totalCost:
      row.totalCostAmount != null && row.totalCostCurrency != null
        ? { amount: row.totalCostAmount, currency: row.totalCostCurrency }
        : undefined,
  };
}

export class DrizzleRideRepository implements IRideRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<Ride | null> {
    const rows = await this.db.select().from(rides).where(eq(rides.id, id)).limit(1);
    return rows[0] ? rowToRide(rows[0]) : null;
  }

  async findActiveByUserId(userId: string): Promise<Ride | null> {
    const rows = await this.db
      .select()
      .from(rides)
      .where(eq(rides.userId, userId))
      .limit(1);
    const active = rows.find((r) => r.status === RideStatus.ACTIVE || r.status === RideStatus.PAUSED);
    return active ? rowToRide(active) : null;
  }

  async create(data: Omit<Ride, 'id'>): Promise<Ride> {
    const id = crypto.randomUUID();
    await this.db.insert(rides).values({
      id,
      userId: data.userId,
      vehicleId: data.vehicleId,
      bookingId: data.bookingId ?? null,
      status: data.status,
      startedAt: data.startedAt,
      endedAt: data.endedAt ?? null,
      startLat: data.startLocation.lat,
      startLng: data.startLocation.lng,
      endLat: data.endLocation?.lat ?? null,
      endLng: data.endLocation?.lng ?? null,
      distanceKm: data.distanceKm ?? null,
      durationMinutes: data.durationMinutes ?? null,
      totalCostAmount: data.totalCost?.amount ?? null,
      totalCostCurrency: data.totalCost?.currency ?? null,
    });
    return { id, ...data };
  }

  async updateStatus(id: string, status: RideStatus): Promise<void> {
    await this.db.update(rides).set({ status }).where(eq(rides.id, id));
  }

  async end(
    id: string,
    data: Pick<Ride, 'endedAt' | 'endLocation' | 'distanceKm' | 'durationMinutes' | 'totalCost'>
  ): Promise<Ride> {
    await this.db
      .update(rides)
      .set({
        status: RideStatus.ENDED,
        endedAt: data.endedAt ?? null,
        endLat: data.endLocation?.lat ?? null,
        endLng: data.endLocation?.lng ?? null,
        distanceKm: data.distanceKm ?? null,
        durationMinutes: data.durationMinutes ?? null,
        totalCostAmount: data.totalCost?.amount ?? null,
        totalCostCurrency: data.totalCost?.currency ?? null,
      })
      .where(eq(rides.id, id));
    const ride = await this.findById(id);
    if (!ride) throw new Error(`Ride ${id} not found after end`);
    return ride;
  }
}
