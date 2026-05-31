import type { Ride, IRideRepository } from '@vsa/contracts'

export class SqliteRideRepository implements IRideRepository {
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
