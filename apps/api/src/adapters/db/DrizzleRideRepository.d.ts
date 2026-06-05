import { IRideRepository, Ride, RideStatus } from '@mvp/contracts';
import { Db } from '../../db';
export declare class DrizzleRideRepository implements IRideRepository {
    private readonly db;
    constructor(db: Db);
    findById(id: string): Promise<Ride | null>;
    findActiveByUserId(userId: string): Promise<Ride | null>;
    create(data: Omit<Ride, 'id'>): Promise<Ride>;
    updateStatus(id: string, status: RideStatus): Promise<void>;
    end(id: string, data: Pick<Ride, 'endedAt' | 'endLocation' | 'distanceKm' | 'durationMinutes' | 'totalCost'>): Promise<Ride>;
}
