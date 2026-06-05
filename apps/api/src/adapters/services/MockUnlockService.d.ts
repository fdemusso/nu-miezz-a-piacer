import { IUnlockService } from '@mvp/contracts';
export declare class MockUnlockService implements IUnlockService {
    unlock(_vehicleId: string, _rideId: string): Promise<{
        success: boolean;
        unlockCode: string;
    }>;
    lock(_vehicleId: string, _rideId: string): Promise<{
        success: boolean;
    }>;
}
