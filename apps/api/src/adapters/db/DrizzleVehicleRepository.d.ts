import { IVehicleRepository, Vehicle, VehicleStatus, Coordinates } from '@mvp/contracts';
import { Db } from '../../db';
export declare class DrizzleVehicleRepository implements IVehicleRepository {
    private readonly db;
    constructor(db: Db);
    findById(id: string): Promise<Vehicle | null>;
    findNearby(coords: Coordinates, radiusKm: number): Promise<Vehicle[]>;
    updateStatus(id: string, status: VehicleStatus): Promise<void>;
    updateLocation(id: string, location: Coordinates): Promise<void>;
}
