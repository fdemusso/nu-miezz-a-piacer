import type { Booking, IBookingRepository } from '@vsa/contracts'
import { getDb } from './db'

export class InMemoryBookingRepository implements IBookingRepository {
  private byId = new Map<string, Booking>()

  async findById(bookingId: string): Promise<Booking | null> {
    return this.byId.get(bookingId) ?? null
  }

  async findActiveByUser(userId: string): Promise<Booking[]> {
    return [...this.byId.values()].filter(b => b.userId === userId && b.status === 'active')
  }

  async findExpired(): Promise<Booking[]> {
    const now = Date.now()
    return [...this.byId.values()].filter(
      b => b.status === 'active' && b.expiresAt.getTime() < now,
    )
  }

  async save(booking: Booking): Promise<void> {
    this.byId.set(booking.id, booking)
  }
}

export class SqliteBookingRepository implements IBookingRepository {
  async findById(bookingId: string): Promise<Booking | null> {
    const row = getDb().prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId) as BookingRow | undefined
    return row ? rowToBooking(row) : null
  }

  async findActiveByUser(userId: string): Promise<Booking[]> {
    const rows = getDb().prepare("SELECT * FROM bookings WHERE user_id = ? AND status = 'active'").all(userId) as BookingRow[]
    return rows.map(rowToBooking)
  }

  async findExpired(): Promise<Booking[]> {
    const now = new Date().toISOString()
    const rows = getDb().prepare("SELECT * FROM bookings WHERE status = 'active' AND expires_at < ?").all(now) as BookingRow[]
    return rows.map(rowToBooking)
  }

  async save(booking: Booking): Promise<void> {
    getDb()
      .prepare('INSERT OR REPLACE INTO bookings (id, user_id, vehicle_id, created_at, expires_at, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(booking.id, booking.userId, booking.vehicleId, booking.createdAt.toISOString(), booking.expiresAt.toISOString(), booking.status)
  }
}

interface BookingRow { id: string; user_id: string; vehicle_id: string; created_at: string; expires_at: string; status: string }
function rowToBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    userId: r.user_id,
    vehicleId: r.vehicle_id,
    createdAt: new Date(r.created_at),
    expiresAt: new Date(r.expires_at),
    status: r.status as Booking['status'],
  }
}
