"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleRideRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const contracts_1 = require("@mvp/contracts");
const schema_1 = require("../../db/schema");
function rowToRide(row) {
    return {
        id: row.id,
        userId: row.userId,
        vehicleId: row.vehicleId,
        bookingId: row.bookingId ?? undefined,
        status: row.status,
        startedAt: row.startedAt,
        endedAt: row.endedAt ?? undefined,
        startLocation: { lat: row.startLat, lng: row.startLng },
        endLocation: row.endLat != null && row.endLng != null ? { lat: row.endLat, lng: row.endLng } : undefined,
        distanceKm: row.distanceKm ?? undefined,
        durationMinutes: row.durationMinutes ?? undefined,
        totalCost: row.totalCostAmount != null && row.totalCostCurrency != null
            ? { amount: row.totalCostAmount, currency: row.totalCostCurrency }
            : undefined,
    };
}
class DrizzleRideRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const rows = await this.db.select().from(schema_1.rides).where((0, drizzle_orm_1.eq)(schema_1.rides.id, id)).limit(1);
        return rows[0] ? rowToRide(rows[0]) : null;
    }
    async findActiveByUserId(userId) {
        const rows = await this.db
            .select()
            .from(schema_1.rides)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.rides.userId, userId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.rides.status, contracts_1.RideStatus.ACTIVE), (0, drizzle_orm_1.eq)(schema_1.rides.status, contracts_1.RideStatus.PAUSED))))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.rides.startedAt))
            .limit(1);
        return rows[0] ? rowToRide(rows[0]) : null;
    }
    async findByUserId(userId) {
        const rows = await this.db
            .select()
            .from(schema_1.rides)
            .where((0, drizzle_orm_1.eq)(schema_1.rides.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.rides.startedAt));
        return rows.map(rowToRide);
    }
    async create(data) {
        const id = crypto.randomUUID();
        await this.db.insert(schema_1.rides).values({
            id,
            userId: data.userId,
            vehicleId: data.vehicleId,
            bookingId: data.bookingId ?? null,
            status: data.status,
            startedAt: data.startedAt,
            endedAt: data.endedAt ?? null,
            startLat: data.startLocation.lat,
            startLng: data.startLocation.lng,
            endLat: data.endLocation?.lat ?? null,
            endLng: data.endLocation?.lng ?? null,
            distanceKm: data.distanceKm ?? null,
            durationMinutes: data.durationMinutes ?? null,
            totalCostAmount: data.totalCost?.amount ?? null,
            totalCostCurrency: data.totalCost?.currency ?? null,
        });
        return { id, ...data };
    }
    async updateStatus(id, status) {
        await this.db.update(schema_1.rides).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.rides.id, id));
    }
    async end(id, data) {
        await this.db
            .update(schema_1.rides)
            .set({
            status: contracts_1.RideStatus.ENDED,
            endedAt: data.endedAt ?? null,
            endLat: data.endLocation?.lat ?? null,
            endLng: data.endLocation?.lng ?? null,
            distanceKm: data.distanceKm ?? null,
            durationMinutes: data.durationMinutes ?? null,
            totalCostAmount: data.totalCost?.amount ?? null,
            totalCostCurrency: data.totalCost?.currency ?? null,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.rides.id, id));
        const ride = await this.findById(id);
        if (!ride)
            throw new Error(`Ride ${id} not found after end`);
        return ride;
    }
}
exports.DrizzleRideRepository = DrizzleRideRepository;
