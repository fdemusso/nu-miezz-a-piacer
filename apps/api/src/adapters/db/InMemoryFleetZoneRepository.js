"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryFleetZoneRepository = void 0;
const DEMO_ZONES = [
    {
        id: 'z1',
        name: 'Centro Storico',
        center: { lat: 45.4654, lng: 9.1859 },
        radiusKm: 1.5,
    },
    {
        id: 'z2',
        name: 'Navigli',
        center: { lat: 45.455, lng: 9.178 },
        radiusKm: 0.8,
    },
];
class InMemoryFleetZoneRepository {
    zones = DEMO_ZONES;
    async findAll() {
        return this.zones;
    }
    async findById(id) {
        return this.zones.find((z) => z.id === id) ?? null;
    }
}
exports.InMemoryFleetZoneRepository = InMemoryFleetZoneRepository;
