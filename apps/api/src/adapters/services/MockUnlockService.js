"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUnlockService = void 0;
class MockUnlockService {
    async unlock(_vehicleId, _rideId) {
        return { success: true, unlockCode: 'MOCK-UNLOCK-001' };
    }
    async lock(_vehicleId, _rideId) {
        return { success: true };
    }
}
exports.MockUnlockService = MockUnlockService;
