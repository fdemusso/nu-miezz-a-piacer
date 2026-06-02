import type { Vehicle, Coordinates, IVehicleRepository } from '@vsa/contracts'
import { getDb } from './db'

const EARTH_R = 6_371_000

function haversine(a: Coordinates, b: Coordinates): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.sqrt(h))
}

export class InMemoryVehicleRepository implements IVehicleRepository {
  private byId = new Map<string, Vehicle>()

  async findById(vehicleId: string): Promise<Vehicle | null> {
    return this.byId.get(vehicleId) ?? null
  }

  async findNearby(position: Coordinates, radiusMeters: number): Promise<Vehicle[]> {
    return [...this.byId.values()].filter(v => haversine(v.position, position) <= radiusMeters)
  }

  async findAll(): Promise<Vehicle[]> {
    return [...this.byId.values()]
  }

  async save(vehicle: Vehicle): Promise<void> {
    this.byId.set(vehicle.id, vehicle)
  }
}

export class SqliteVehicleRepository implements IVehicleRepository {
  async findById(vehicleId: string): Promise<Vehicle | null> {
    const row = getDb().prepare('SELECT * FROM vehicles WHERE id = ?').get(vehicleId) as VehicleRow | undefined
    return row ? rowToVehicle(row) : null
  }

  async findNearby(position: Coordinates, radiusMeters: number): Promise<Vehicle[]> {
    const all = await this.findAll()
    return all.filter(v => haversine(v.position, position) <= radiusMeters)
  }

  async findAll(): Promise<Vehicle[]> {
    const rows = getDb().prepare('SELECT * FROM vehicles').all() as VehicleRow[]
    return rows.map(rowToVehicle)
  }

  async save(vehicle: Vehicle): Promise<void> {
    getDb()
      .prepare('INSERT OR REPLACE INTO vehicles (id, type, status, battery_level, lat, lng, license_plate) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(vehicle.id, vehicle.type, vehicle.status, vehicle.batteryLevel, vehicle.position.lat, vehicle.position.lng, vehicle.licensePlate)
  }
}

interface VehicleRow { id: string; type: string; status: string; battery_level: number; lat: number; lng: number; license_plate: string }
function rowToVehicle(r: VehicleRow): Vehicle {
  return {
    id: r.id,
    type: r.type as Vehicle['type'],
    status: r.status as Vehicle['status'],
    batteryLevel: r.battery_level,
    position: { lat: r.lat, lng: r.lng },
    licensePlate: r.license_plate,
  }
}
