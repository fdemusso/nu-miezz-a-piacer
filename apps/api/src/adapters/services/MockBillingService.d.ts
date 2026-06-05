import { IBillingService, Money, PricingPlan } from '@mvp/contracts';
export declare class MockBillingService implements IBillingService {
    calculateRideCost(startedAt: Date, endedAt: Date, _distanceKm: number, pricing: PricingPlan): Promise<Money>;
    chargeUser(_userId: string, _amount: Money, rideId: string): Promise<{
        transactionId: string;
    }>;
}
