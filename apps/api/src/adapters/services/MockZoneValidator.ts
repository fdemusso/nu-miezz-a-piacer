import { IZoneValidator, Coordinates } from '@mvp/contracts';

export class MockZoneValidator implements IZoneValidator {
  async isInServiceZone(_coords: Coordinates): Promise<boolean> {
    return true;
  }

  async isInParkingZone(_coords: Coordinates): Promise<{ valid: boolean; zoneId?: string }> {
    return { valid: true, zoneId: 'zone-default' };
  }
}
