import type { Money, PaymentMethod, IBillingService } from '@vsa/contracts'

interface Charge { userId: string; amount: Money; at: Date }

export class MockBillingProcessor implements IBillingService {
  private charges: Charge[] = []
  private methods = new Map<string, PaymentMethod[]>()

  async charge(userId: string, amount: Money): Promise<void> {
    this.charges.push({ userId, amount, at: new Date() })
  }

  async addPaymentMethod(userId: string, method: PaymentMethod): Promise<void> {
    const list = this.methods.get(userId) ?? []
    list.push(method)
    this.methods.set(userId, list)
  }

  async removePaymentMethod(userId: string, methodId: string): Promise<void> {
    const list = this.methods.get(userId) ?? []
    this.methods.set(userId, list.filter(m => m.id !== methodId))
  }

  async listPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return [...(this.methods.get(userId) ?? [])]
  }

  getChargesForTest(): Charge[] { return [...this.charges] }
}
