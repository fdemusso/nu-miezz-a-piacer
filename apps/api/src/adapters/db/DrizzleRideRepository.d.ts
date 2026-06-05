import { IRideRepository, Ride, RideStatus } from '@mvp/contracts';
import { Db } from '../../db';
export declare class DrizzleRideRepository implements IRideRepository {
    private readonly db;
    constructor(db: Db);
    findById(_id: string): Promise<Ride | null>;
    findActiveByUserId(_userId: string): Promise<Ride | null>;
    create(_data: Omit<Ride, 'id'>): Promise<Ride>;
    updateStatus(_id: string, _status: RideStatus): Promise<void>;
    end(_id: string, _data: Pick<Ride, 'endedAt' | 'endLocation' | 'distanceKm' | 'durationMinutes' | 'totalCost'>): Promise<Ride>;
}
