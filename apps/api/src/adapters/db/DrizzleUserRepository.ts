import { eq } from 'drizzle-orm';
import { IUserRepository, UserRole } from '@mvp/contracts';
import { Db } from '../../db';
import { users } from '../../db/schema';

type User = import('@mvp/contracts').User;

function rowToUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    createdAt: row.createdAt,
  };
}

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  async create(_data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    throw new Error('Not implemented');
  }
}
