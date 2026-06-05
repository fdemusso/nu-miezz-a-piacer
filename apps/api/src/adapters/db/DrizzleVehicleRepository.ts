import { IVehicleRepository, Vehicle, VehicleStatus, Coordinates } from '@mvp/contracts';
import { Db } from '../../db';

export class DrizzleVehicleRepository implements IVehicleRepository {
  constructor(private readonly db: Db) {}

  async findById(_id: string): Promise<Vehicle | null> {
    // TODO: implement
    return null;
  }

  async findNearby(_coords: Coordinates, _radiusKm: number): Promise<Vehicle[]> {
    // TODO: implement with haversine distance query
    return [];
  }

  async updateStatus(_id: string, _status: VehicleStatus): Promise<void> {
    // TODO: implement
  }

  async updateLocation(_id: string, _location: Coordinates): Promise<void> {
    // TODO: implement
  }
}
