import type { FleetZone, IFleetZoneRepository } from '@vsa/contracts'
import { getDb } from './db'

export class InMemoryFleetZoneRepository implements IFleetZoneRepository {
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

export class SqliteFleetZoneRepository implements IFleetZoneRepository {
  async findAll(): Promise<FleetZone[]> {
    const rows = getDb().prepare('SELECT * FROM fleet_zones').all() as FleetZoneRow[]
    return rows.map(rowToFleetZone)
  }

  async findById(zoneId: string): Promise<FleetZone | null> {
    const row = getDb().prepare('SELECT * FROM fleet_zones WHERE id = ?').get(zoneId) as FleetZoneRow | undefined
    return row ? rowToFleetZone(row) : null
  }

  async save(zone: FleetZone): Promise<void> {
    getDb()
      .prepare('INSERT OR REPLACE INTO fleet_zones (id, name, boundary, vehicle_count, target_count) VALUES (?, ?, ?, ?, ?)')
      .run(zone.id, zone.name, JSON.stringify(zone.boundary), zone.vehicleCount, zone.targetCount)
  }
}

interface FleetZoneRow { id: string; name: string; boundary: string; vehicle_count: number; target_count: number }
function rowToFleetZone(r: FleetZoneRow): FleetZone {
  return { id: r.id, name: r.name, boundary: JSON.parse(r.boundary), vehicleCount: r.vehicle_count, targetCount: r.target_count }
}
