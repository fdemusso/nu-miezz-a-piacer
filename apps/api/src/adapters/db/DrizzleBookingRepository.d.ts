import { IBookingRepository, Booking, BookingStatus } from '@mvp/contracts';
import { Db } from '../../db';
export declare class DrizzleBookingRepository implements IBookingRepository {
    private readonly db;
    constructor(db: Db);
    findById(id: string): Promise<Booking | null>;
    findActiveByUserId(userId: string): Promise<Booking | null>;
    create(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking>;
    updateStatus(id: string, status: BookingStatus): Promise<void>;
}
