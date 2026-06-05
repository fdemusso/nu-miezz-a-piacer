import { IGpsTrackingService, Coordinates } from '@mvp/contracts';

const FALLBACK_POSITION: Coordinates = { lat: 45.4654, lng: 9.1859 };

export class MockGpsTrackingService implements IGpsTrackingService {
  async getCurrentPosition(_vehicleId: string): Promise<Coordinates | null> {
    return null;
  }

  async resolveUserPosition(provided: Coordinates | null): Promise<Coordinates> {
    return provided ?? FALLBACK_POSITION;
  }
}
