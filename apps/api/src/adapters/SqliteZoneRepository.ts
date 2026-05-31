import type { ZoneRule, IZoneRepository } from '@vsa/contracts'

export class SqliteZoneRepository implements IZoneRepository {
  private byId = new Map<string, ZoneRule>()

  async findAll(): Promise<ZoneRule[]> {
    return [...this.byId.values()]
  }

  async save(zone: ZoneRule): Promise<void> {
    this.byId.set(zone.id, zone)
  }
}
