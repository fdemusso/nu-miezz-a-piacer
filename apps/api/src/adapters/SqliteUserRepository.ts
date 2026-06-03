import type { User, IUserRepository } from '@vsa/contracts'
import type { Db } from './db'

export class InMemoryUserRepository implements IUserRepository {
  private byId = new Map<string, User>()
  private byEmail = new Map<string, string>()

  async findById(userId: string): Promise<User | null> {
    return this.byId.get(userId) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const id = this.byEmail.get(email.toLowerCase())
    return id ? this.byId.get(id) ?? null : null
  }

  async save(user: User): Promise<void> {
    this.byId.set(user.id, user)
    this.byEmail.set(user.email.toLowerCase(), user.id)
  }
}

export class SqliteUserRepository implements IUserRepository {
  constructor(private readonly db: Db) {}

  async findById(userId: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined
    return row ? rowToUser(row) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as UserRow | undefined
    return row ? rowToUser(row) : null
  }

  async save(user: User): Promise<void> {
    this.db
      .prepare('INSERT OR REPLACE INTO users (id, email, role, name, suspended) VALUES (?, ?, ?, ?, ?)')
      .run(user.id, user.email.toLowerCase(), user.role, user.name, user.suspended ? 1 : 0)
  }
}

interface UserRow { id: string; email: string; role: string; name: string; suspended: number }
function rowToUser(r: UserRow): User {
  return { id: r.id, email: r.email, role: r.role as User['role'], name: r.name, suspended: r.suspended === 1 }
}
