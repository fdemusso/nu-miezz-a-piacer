import type { Ride, IRideRepository } from '@vsa/contracts'
import { getDb } from './db'

export class InMemoryRideRepository implements IRideRepository {
  private byId = new Map<string, Ride>()

  async findById(rideId: string): Promise<Ride | null> {
    return this.byId.get(rideId) ?? null
  }

  async findActiveByUser(userId: string): Promise<Ride | null> {
    for (const r of this.byId.values()) {
      if (r.userId === userId && !r.endedAt) return r
    }
    return null
  }

  async save(ride: Ride): Promise<void> {
    this.byId.set(ride.id, ride)
  }

  async findAll(): Promise<Ride[]> {
    return [...this.byId.values()]
  }
}

export class SqliteRideRepository implements IRideRepository {
  async findById(rideId: string): Promise<Ride | null> {
    const row = getDb().prepare('SELECT * FROM rides WHERE id = ?').get(rideId) as RideRow | undefined
    return row ? rowToRide(row) : null
  }

  async findActiveByUser(userId: string): Promise<Ride | null> {
    const row = getDb().prepare('SELECT * FROM rides WHERE user_id = ? AND ended_at IS NULL LIMIT 1').get(userId) as RideRow | undefined
    return row ? rowToRide(row) : null
  }

  async save(ride: Ride): Promise<void> {
    getDb()
      .prepare(`
        INSERT OR REPLACE INTO rides
          (id, user_id, vehicle_id, started_at, ended_at, start_lat, start_lng, end_lat, end_lng, cost_amount, cost_currency, paused)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        ride.id, ride.userId, ride.vehicleId,
        ride.startedAt.toISOString(),
        ride.endedAt?.toISOString() ?? null,
        ride.startPosition.lat, ride.startPosition.lng,
        ride.endPosition?.lat ?? null, ride.endPosition?.lng ?? null,
        ride.cost?.amount ?? null, ride.cost?.currency ?? null,
        ride.paused ? 1 : 0,
      )
  }

  async findAll(): Promise<Ride[]> {
    const rows = getDb().prepare('SELECT * FROM rides').all() as RideRow[]
    return rows.map(rowToRide)
  }
}

interface RideRow {
  id: string; user_id: string; vehicle_id: string
  started_at: string; ended_at: string | null
  start_lat: number; start_lng: number
  end_lat: number | null; end_lng: number | null
  cost_amount: number | null; cost_currency: string | null
  paused: number
}

function rowToRide(r: RideRow): Ride {
  return {
    id: r.id, userId: r.user_id, vehicleId: r.vehicle_id,
    startedAt: new Date(r.started_at),
    endedAt: r.ended_at ? new Date(r.ended_at) : undefined,
    startPosition: { lat: r.start_lat, lng: r.start_lng },
    endPosition: r.end_lat != null && r.end_lng != null ? { lat: r.end_lat, lng: r.end_lng } : undefined,
    cost: r.cost_amount != null && r.cost_currency != null ? { amount: r.cost_amount, currency: r.cost_currency } : undefined,
    paused: r.paused === 1,
  }
}
