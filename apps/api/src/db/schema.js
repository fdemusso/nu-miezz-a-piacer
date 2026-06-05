"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.rides = exports.bookings = exports.vehicles = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
// Minimal schema bootstrap — full schema added per slice in future prompts
exports.vehicles = (0, sqlite_core_1.sqliteTable)('vehicles', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull().default('AVAILABLE'),
    lat: (0, sqlite_core_1.real)('lat').notNull(),
    lng: (0, sqlite_core_1.real)('lng').notNull(),
    batteryLevel: (0, sqlite_core_1.integer)('battery_level').notNull().default(100),
    batteryRangeKm: (0, sqlite_core_1.real)('battery_range_km').notNull().default(0),
    model: (0, sqlite_core_1.text)('model').notNull(),
    licensePlate: (0, sqlite_core_1.text)('license_plate'),
    imageUrl: (0, sqlite_core_1.text)('image_url'),
    specsJson: (0, sqlite_core_1.text)('specs_json').notNull().default('{}'),
    featuresJson: (0, sqlite_core_1.text)('features_json').notNull().default('{}'),
    pricingJson: (0, sqlite_core_1.text)('pricing_json').notNull().default('{}'),
});
exports.bookings = (0, sqlite_core_1.sqliteTable)('bookings', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    userId: (0, sqlite_core_1.text)('user_id').notNull(),
    vehicleId: (0, sqlite_core_1.text)('vehicle_id').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull().default('PENDING'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull(),
    expiresAt: (0, sqlite_core_1.integer)('expires_at', { mode: 'timestamp' }).notNull(),
    confirmedAt: (0, sqlite_core_1.integer)('confirmed_at', { mode: 'timestamp' }),
    cancelledAt: (0, sqlite_core_1.integer)('cancelled_at', { mode: 'timestamp' }),
});
exports.rides = (0, sqlite_core_1.sqliteTable)('rides', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    userId: (0, sqlite_core_1.text)('user_id').notNull(),
    vehicleId: (0, sqlite_core_1.text)('vehicle_id').notNull(),
    bookingId: (0, sqlite_core_1.text)('booking_id'),
    status: (0, sqlite_core_1.text)('status').notNull().default('ACTIVE'),
    startedAt: (0, sqlite_core_1.integer)('started_at', { mode: 'timestamp' }).notNull(),
    endedAt: (0, sqlite_core_1.integer)('ended_at', { mode: 'timestamp' }),
    startLat: (0, sqlite_core_1.real)('start_lat').notNull(),
    startLng: (0, sqlite_core_1.real)('start_lng').notNull(),
    endLat: (0, sqlite_core_1.real)('end_lat'),
    endLng: (0, sqlite_core_1.real)('end_lng'),
    distanceKm: (0, sqlite_core_1.real)('distance_km'),
    durationMinutes: (0, sqlite_core_1.real)('duration_minutes'),
    totalCostAmount: (0, sqlite_core_1.real)('total_cost_amount'),
    totalCostCurrency: (0, sqlite_core_1.text)('total_cost_currency'),
});
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    email: (0, sqlite_core_1.text)('email').notNull().unique(),
    role: (0, sqlite_core_1.text)('role').notNull().default('RIDER'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull(),
});
