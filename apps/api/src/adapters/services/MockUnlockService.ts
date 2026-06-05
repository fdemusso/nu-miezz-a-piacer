import { IUnlockService } from '@mvp/contracts';

export class MockUnlockService implements IUnlockService {
  async unlock(_vehicleId: string, _rideId: string) {
    return { success: true, unlockCode: 'MOCK-UNLOCK-001' };
  }

  async lock(_vehicleId: string, _rideId: string) {
    return { success: true };
  }
}
