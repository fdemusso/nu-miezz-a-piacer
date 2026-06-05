"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleVehicleRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
function haversineKm(a, b) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const x = Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) *
            Math.cos((b.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function rowToVehicle(row) {
    return {
        id: row.id,
        type: row.type,
        status: row.status,
        location: { lat: row.lat, lng: row.lng },
        battery: {
            level: row.batteryLevel,
            estimatedRangeKm: row.batteryRangeKm,
        },
        model: row.model,
        licensePlate: row.licensePlate ?? undefined,
        imageUrl: row.imageUrl ?? undefined,
        specs: JSON.parse(row.specsJson),
        features: JSON.parse(row.featuresJson),
        pricing: JSON.parse(row.pricingJson),
    };
}
class DrizzleVehicleRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const rows = await this.db.select().from(schema_1.vehicles).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, id)).limit(1);
        return rows[0] ? rowToVehicle(rows[0]) : null;
    }
    async findNearby(coords, radiusKm) {
        const rows = await this.db.select().from(schema_1.vehicles);
        return rows
            .filter((row) => haversineKm(coords, { lat: row.lat, lng: row.lng }) <= radiusKm)
            .sort((a, b) => haversineKm(coords, { lat: a.lat, lng: a.lng }) -
            haversineKm(coords, { lat: b.lat, lng: b.lng }))
            .map(rowToVehicle);
    }
    async updateStatus(id, status) {
        await this.db.update(schema_1.vehicles).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, id));
    }
    async updateLocation(id, location) {
        await this.db.update(schema_1.vehicles).set({ lat: location.lat, lng: location.lng }).where((0, drizzle_orm_1.eq)(schema_1.vehicles.id, id));
    }
}
exports.DrizzleVehicleRepository = DrizzleVehicleRepository;
