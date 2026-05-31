import type { INotificationSender } from '@vsa/contracts'

interface Sent { userId: string; title: string; body: string; at: Date }

export class FirebasePushSender implements INotificationSender {
  private log: Sent[] = []

  async send(userId: string, title: string, body: string): Promise<void> {
    this.log.push({ userId, title, body, at: new Date() })
  }

  async broadcast(userIds: string[], title: string, body: string): Promise<void> {
    const at = new Date()
    for (const userId of userIds) this.log.push({ userId, title, body, at })
  }

  getSentForTest(): Sent[] { return [...this.log] }
}
