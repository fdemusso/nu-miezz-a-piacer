import { IUserRepository } from '@mvp/contracts';
import { Db } from '../../db';

type User = import('@mvp/contracts').User;

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: Db) {}

  async findById(_id: string): Promise<User | null> {
    return null;
  }

  async findByEmail(_email: string): Promise<User | null> {
    return null;
  }

  async create(_data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    throw new Error('Not implemented');
  }
}
