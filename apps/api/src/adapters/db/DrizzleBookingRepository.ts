import { IBookingRepository, Booking, BookingStatus } from '@mvp/contracts';
import { Db } from '../../db';

export class DrizzleBookingRepository implements IBookingRepository {
  constructor(private readonly db: Db) {}

  async findById(_id: string): Promise<Booking | null> {
    return null;
  }

  async findActiveByUserId(_userId: string): Promise<Booking | null> {
    return null;
  }

  async create(_data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    throw new Error('Not implemented');
  }

  async updateStatus(_id: string, _status: BookingStatus): Promise<void> {
    // TODO: implement
  }
}
