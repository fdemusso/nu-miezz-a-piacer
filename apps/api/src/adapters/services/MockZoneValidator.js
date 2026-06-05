"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockZoneValidator = void 0;
class MockZoneValidator {
    async isInServiceZone(_coords) {
        return true;
    }
    async isInParkingZone(_coords) {
        return { valid: true, zoneId: 'zone-default' };
    }
}
exports.MockZoneValidator = MockZoneValidator;
