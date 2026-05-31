import type { User, IUserRepository } from '@vsa/contracts'

export class SqliteUserRepository implements IUserRepository {
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
