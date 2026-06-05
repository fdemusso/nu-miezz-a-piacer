"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBillingService = void 0;
class MockBillingService {
    async calculateRideCost(startedAt, endedAt, _distanceKm, pricing) {
        const minutes = (endedAt.getTime() - startedAt.getTime()) / 60000;
        const amount = pricing.unlockFee.amount + minutes * pricing.perMinuteRate.amount;
        return { amount: Math.round(amount * 100) / 100, currency: pricing.unlockFee.currency };
    }
    async chargeUser(_userId, _amount, rideId) {
        return { transactionId: `mock-txn-${rideId}` };
    }
}
exports.MockBillingService = MockBillingService;
