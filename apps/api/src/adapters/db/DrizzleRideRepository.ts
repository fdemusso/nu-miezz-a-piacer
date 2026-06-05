import { IRideRepository, Ride, RideStatus } from '@mvp/contracts';
import { Db } from '../../db';

export class DrizzleRideRepository implements IRideRepository {
  constructor(private readonly db: Db) {}

  async findById(_id: string): Promise<Ride | null> {
    return null;
  }

  async findActiveByUserId(_userId: string): Promise<Ride | null> {
    return null;
  }

  async create(_data: Omit<Ride, 'id'>): Promise<Ride> {
    throw new Error('Not implemented');
  }

  async updateStatus(_id: string, _status: RideStatus): Promise<void> {
    // TODO: implement
  }

  async end(_id: string, _data: Pick<Ride, 'endedAt' | 'endLocation' | 'distanceKm' | 'durationMinutes' | 'totalCost'>): Promise<Ride> {
    throw new Error('Not implemented');
  }
}
