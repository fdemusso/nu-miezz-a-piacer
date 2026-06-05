"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGpsTrackingService = void 0;
const FALLBACK_POSITION = { lat: 45.4654, lng: 9.1859 };
class MockGpsTrackingService {
    async getCurrentPosition(_vehicleId) {
        return null;
    }
    async resolveUserPosition(provided) {
        return provided ?? FALLBACK_POSITION;
    }
}
exports.MockGpsTrackingService = MockGpsTrackingService;
