import type { Vehicle, Coordinates, IVehicleRepository } from '@vsa/contracts'

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

export class SqliteVehicleRepository implements IVehicleRepository {
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
