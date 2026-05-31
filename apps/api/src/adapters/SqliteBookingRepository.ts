import type { Booking, IBookingRepository } from '@vsa/contracts'

export class SqliteBookingRepository implements IBookingRepository {
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
