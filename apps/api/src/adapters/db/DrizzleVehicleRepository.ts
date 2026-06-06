import { eq } from 'drizzle-orm';
import { IVehicleRepository, Vehicle, VehicleStatus, VehicleType, Coordinates, VehicleSearchFilters } from '@mvp/contracts';
import { Db } from '../../db';
import { vehicles } from '../../db/schema';

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function rowToVehicle(row: typeof vehicles.$inferSelect): Vehicle {
  return {
    id: row.id,
    type: row.type as VehicleType,
    status: row.status as VehicleStatus,
    location: { lat: row.lat, lng: row.lng },
    battery: {
      level: row.batteryLevel,
      estimatedRangeKm: row.batteryRangeKm,
    },
    model: row.model,
    licensePlate: row.licensePlate ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    specs: JSON.parse(row.specsJson),
    features: JSON.parse(row.featuresJson),
    pricing: JSON.parse(row.pricingJson),
  };
}

export class DrizzleVehicleRepository implements IVehicleRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<Vehicle | null> {
    const rows = await this.db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return rows[0] ? rowToVehicle(rows[0]) : null;
  }

  async findNearby(coords: Coordinates, radiusKm: number): Promise<Vehicle[]> {
    const rows = await this.db.select().from(vehicles);
    return rows
      .filter((row) => haversineKm(coords, { lat: row.lat, lng: row.lng }) <= radiusKm)
      .sort(
        (a, b) =>
          haversineKm(coords, { lat: a.lat, lng: a.lng }) -
          haversineKm(coords, { lat: b.lat, lng: b.lng })
      )
      .map(rowToVehicle);
  }

  async search(filters: VehicleSearchFilters): Promise<Vehicle[]> {
    const rows = await this.db.select().from(vehicles);
    return rows
      .filter((row) => {
        if (filters.type && row.type !== filters.type) return false;
        if (filters.onlyAvailable && row.status !== VehicleStatus.AVAILABLE) return false;
        if (filters.query) {
          const q = filters.query.toLowerCase();
          const plate = (row.licensePlate ?? '').toLowerCase();
          const model = row.model.toLowerCase();
          if (!plate.includes(q) && !model.includes(q)) return false;
        }
        return true;
      })
      .map(rowToVehicle);
  }

  async updateStatus(id: string, status: VehicleStatus): Promise<void> {
    await this.db.update(vehicles).set({ status }).where(eq(vehicles.id, id));
  }

  async updateLocation(id: string, location: Coordinates): Promise<void> {
    await this.db.update(vehicles).set({ lat: location.lat, lng: location.lng }).where(eq(vehicles.id, id));
  }
}
