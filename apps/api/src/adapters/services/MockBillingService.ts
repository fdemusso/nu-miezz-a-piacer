import { IBillingService, Money, PricingPlan } from '@mvp/contracts';

export class MockBillingService implements IBillingService {
  async calculateRideCost(
    startedAt: Date,
    endedAt: Date,
    _distanceKm: number,
    pricing: PricingPlan
  ): Promise<Money> {
    const minutes = (endedAt.getTime() - startedAt.getTime()) / 60000;
    const amount =
      pricing.unlockFee.amount + minutes * pricing.perMinuteRate.amount;
    return { amount: Math.round(amount * 100) / 100, currency: pricing.unlockFee.currency };
  }

  async chargeUser(_userId: string, _amount: Money, rideId: string) {
    return { transactionId: `mock-txn-${rideId}` };
  }
}
