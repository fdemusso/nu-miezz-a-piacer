import { IBookingRepository, Booking, BookingStatus } from '@mvp/contracts';
import { Db } from '../../db';
export declare class DrizzleBookingRepository implements IBookingRepository {
    private readonly db;
    constructor(db: Db);
    findById(_id: string): Promise<Booking | null>;
    findActiveByUserId(_userId: string): Promise<Booking | null>;
    create(_data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking>;
    updateStatus(_id: string, _status: BookingStatus): Promise<void>;
}
