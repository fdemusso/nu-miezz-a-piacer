import { IUserRepository } from '@mvp/contracts';
import { Db } from '../../db';
type User = import('@mvp/contracts').User;
export declare class DrizzleUserRepository implements IUserRepository {
    private readonly db;
    constructor(db: Db);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(_data: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}
export {};
