"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleBookingRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const contracts_1 = require("@mvp/contracts");
const schema_1 = require("../../db/schema");
const INACTIVE_STATUSES = [
    contracts_1.BookingStatus.CANCELLED,
    contracts_1.BookingStatus.EXPIRED,
    contracts_1.BookingStatus.COMPLETED,
    contracts_1.BookingStatus.CONVERTED_TO_RIDE,
];
function rowToBooking(row) {
    return {
        id: row.id,
        userId: row.userId,
        vehicleId: row.vehicleId,
        status: row.status,
        createdAt: row.createdAt,
        expiresAt: row.expiresAt,
        confirmedAt: row.confirmedAt ?? undefined,
        cancelledAt: row.cancelledAt ?? undefined,
    };
}
class DrizzleBookingRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const rows = await this.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id)).limit(1);
        return rows[0] ? rowToBooking(rows[0]) : null;
    }
    async findActiveByUserId(userId) {
        const rows = await this.db
            .select()
            .from(schema_1.bookings)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId), (0, drizzle_orm_1.notInArray)(schema_1.bookings.status, INACTIVE_STATUSES)))
            .limit(1);
        return rows[0] ? rowToBooking(rows[0]) : null;
    }
    async create(data) {
        const id = crypto.randomUUID();
        const now = new Date();
        await this.db.insert(schema_1.bookings).values({
            id,
            userId: data.userId,
            vehicleId: data.vehicleId,
            status: data.status,
            createdAt: now,
            expiresAt: data.expiresAt,
            confirmedAt: data.confirmedAt ?? null,
            cancelledAt: data.cancelledAt ?? null,
        });
        return { id, createdAt: now, ...data };
    }
    async updateStatus(id, status) {
        await this.db.update(schema_1.bookings).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id));
    }
}
exports.DrizzleBookingRepository = DrizzleBookingRepository;
