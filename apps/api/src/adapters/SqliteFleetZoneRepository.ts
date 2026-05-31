import type { FleetZone, IFleetZoneRepository } from '@vsa/contracts'

export class SqliteFleetZoneRepository implements IFleetZoneRepository {
  private byId = new Map<string, FleetZone>()

  async findAll(): Promise<FleetZone[]> {
    return [...this.byId.values()]
  }

  async findById(zoneId: string): Promise<FleetZone | null> {
    return this.byId.get(zoneId) ?? null
  }

  async save(zone: FleetZone): Promise<void> {
    this.byId.set(zone.id, zone)
  }
}
