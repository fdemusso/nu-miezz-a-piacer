import { IZoneValidator, Coordinates } from '@mvp/contracts';
export declare class MockZoneValidator implements IZoneValidator {
    isInServiceZone(_coords: Coordinates): Promise<boolean>;
    isInParkingZone(_coords: Coordinates): Promise<{
        valid: boolean;
        zoneId?: string;
    }>;
}
