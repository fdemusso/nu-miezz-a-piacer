import { IGpsTrackingService, Coordinates } from '@mvp/contracts';
export declare class MockGpsTrackingService implements IGpsTrackingService {
    getCurrentPosition(_vehicleId: string): Promise<Coordinates | null>;
    resolveUserPosition(provided: Coordinates | null): Promise<Coordinates>;
}
