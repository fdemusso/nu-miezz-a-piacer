import type { User, IAuthService } from '@vsa/contracts'

export class JwtAuthService implements IAuthService {
  private users = new Map<string, User>()
  private suspended = new Set<string>()

  registerForTest(user: User): void {
    this.users.set(user.email.toLowerCase(), user)
  }

  async authenticate(email: string, _password: string): Promise<User> {
    const user = this.users.get(email.toLowerCase())
    if (!user) throw new Error('invalid credentials')
    if (this.suspended.has(user.id)) throw new Error('user suspended')
    return user
  }

  async suspendUser(userId: string): Promise<void> {
    this.suspended.add(userId)
  }
}
