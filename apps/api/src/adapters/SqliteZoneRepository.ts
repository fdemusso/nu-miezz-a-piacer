import type { ZoneRule, IZoneRepository } from '@vsa/contracts'
import type { Db } from './db'

export class InMemoryZoneRepository implements IZoneRepository {
  private byId = new Map<string, ZoneRule>()

  async findAll(): Promise<ZoneRule[]> {
    return [...this.byId.values()]
  }

  async save(zone: ZoneRule): Promise<void> {
    this.byId.set(zone.id, zone)
  }
}

export class SqliteZoneRepository implements IZoneRepository {
  constructor(private readonly db: Db) {}

  async findAll(): Promise<ZoneRule[]> {
    const rows = this.db.prepare('SELECT * FROM zones').all() as ZoneRow[]
    return rows.map(rowToZone)
  }

  async save(zone: ZoneRule): Promise<void> {
    this.db
      .prepare('INSERT OR REPLACE INTO zones (id, type, name, boundary) VALUES (?, ?, ?, ?)')
      .run(zone.id, zone.type, zone.name, JSON.stringify(zone.boundary))
  }
}

interface ZoneRow { id: string; type: string; name: string; boundary: string }
function rowToZone(r: ZoneRow): ZoneRule {
  return { id: r.id, type: r.type as ZoneRule['type'], name: r.name, boundary: JSON.parse(r.boundary) }
}
