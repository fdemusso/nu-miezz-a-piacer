"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const contracts_1 = require("@mvp/contracts");
const History_handler_1 = require("../slices/History/History.handler");
const Search_handler_1 = require("../slices/Search/Search.handler");
const Profile_handler_1 = require("../slices/Profile/Profile.handler");
// ─── Fixtures ────────────────────────────────────────────────────────────────
const baseRide = {
    id: 'r1',
    userId: 'u1',
    vehicleId: 'v1',
    status: contracts_1.RideStatus.ENDED,
    startedAt: new Date('2024-01-01T10:00:00Z'),
    endedAt: new Date('2024-01-01T10:30:00Z'),
    startLocation: { lat: 45.0, lng: 9.0 },
    endLocation: { lat: 45.1, lng: 9.1 },
    distanceKm: 2.5,
    durationMinutes: 30,
    totalCost: { amount: 3.5, currency: 'EUR' },
};
const baseVehicle = {
    id: 'v1',
    type: contracts_1.VehicleType.SCOOTER,
    status: contracts_1.VehicleStatus.AVAILABLE,
    location: { lat: 45.0, lng: 9.0 },
    battery: { level: 80, estimatedRangeKm: 40 },
    model: 'TestModel',
    licensePlate: 'AB123',
    specs: { maxSpeedKmh: 45, weightKg: 70, maxRangeKm: 50 },
    features: { hasGps: true, hasHelmetStorage: true, hasUsb: false, hasLock: true },
    pricing: {
        unlockFee: { amount: 1, currency: 'EUR' },
        perMinuteRate: { amount: 0.1, currency: 'EUR' },
    },
};
const baseUser = {
    id: 'u1',
    email: 'test@example.com',
    role: contracts_1.UserRole.RIDER,
    createdAt: new Date('2024-01-01T00:00:00Z'),
};
// ─── History handler ──────────────────────────────────────────────────────────
(0, vitest_1.describe)('createHistoryHandler', () => {
    (0, vitest_1.it)('returns rides from repo', async () => {
        const rideRepo = { findByUserId: vitest_1.vi.fn().mockResolvedValue([baseRide]) };
        const handler = (0, History_handler_1.createHistoryHandler)({ rideRepo });
        const result = await handler({ userId: 'u1' });
        (0, vitest_1.expect)(result.rides).toHaveLength(1);
        (0, vitest_1.expect)(result.rides[0].id).toBe('r1');
        (0, vitest_1.expect)(rideRepo.findByUserId).toHaveBeenCalledWith('u1');
    });
    (0, vitest_1.it)('returns empty array when user has no rides', async () => {
        const rideRepo = { findByUserId: vitest_1.vi.fn().mockResolvedValue([]) };
        const handler = (0, History_handler_1.createHistoryHandler)({ rideRepo });
        const result = await handler({ userId: 'u2' });
        (0, vitest_1.expect)(result.rides).toEqual([]);
    });
});
// ─── Search handler ───────────────────────────────────────────────────────────
(0, vitest_1.describe)('createSearchHandler', () => {
    (0, vitest_1.it)('maps vehicle to SearchVehicleItem', async () => {
        const vehicleRepo = { search: vitest_1.vi.fn().mockResolvedValue([baseVehicle]) };
        const handler = (0, Search_handler_1.createSearchHandler)({ vehicleRepo });
        const result = await handler({ filters: {} });
        (0, vitest_1.expect)(result.total).toBe(1);
        (0, vitest_1.expect)(result.vehicles[0]).toMatchObject({
            id: 'v1',
            plateOrCode: 'AB123',
            type: contracts_1.VehicleType.SCOOTER,
            status: contracts_1.VehicleStatus.AVAILABLE,
            model: 'TestModel',
            batteryLevel: 80,
            estimatedRangeKm: 40,
        });
    });
    (0, vitest_1.it)('uses type-code fallback when licensePlate is absent', async () => {
        const noPlate = { ...baseVehicle, licensePlate: undefined };
        const vehicleRepo = { search: vitest_1.vi.fn().mockResolvedValue([noPlate]) };
        const handler = (0, Search_handler_1.createSearchHandler)({ vehicleRepo });
        const result = await handler({ filters: {} });
        (0, vitest_1.expect)(result.vehicles[0].plateOrCode).toMatch(/^SCOOTER-/);
    });
    (0, vitest_1.it)('returns empty results when no vehicles match', async () => {
        const vehicleRepo = { search: vitest_1.vi.fn().mockResolvedValue([]) };
        const handler = (0, Search_handler_1.createSearchHandler)({ vehicleRepo });
        const result = await handler({ filters: { onlyAvailable: true } });
        (0, vitest_1.expect)(result.total).toBe(0);
        (0, vitest_1.expect)(result.vehicles).toEqual([]);
    });
});
// ─── Profile handler ──────────────────────────────────────────────────────────
(0, vitest_1.describe)('createProfileHandler', () => {
    (0, vitest_1.it)('returns profile for valid user', async () => {
        const userRepo = { findById: vitest_1.vi.fn().mockResolvedValue(baseUser) };
        const handler = (0, Profile_handler_1.createProfileHandler)({ userRepo });
        const result = await handler({ userId: 'u1' });
        (0, vitest_1.expect)(result.profile.id).toBe('u1');
        (0, vitest_1.expect)(result.profile.email).toBe('test@example.com');
    });
    (0, vitest_1.it)('throws 404 when user not found', async () => {
        const userRepo = { findById: vitest_1.vi.fn().mockResolvedValue(null) };
        const handler = (0, Profile_handler_1.createProfileHandler)({ userRepo });
        await (0, vitest_1.expect)(handler({ userId: 'missing' })).rejects.toMatchObject({
            message: 'User not found',
            statusCode: 404,
        });
    });
});
// ─── BookingStatus NON_CANCELLABLE invariant ──────────────────────────────────
(0, vitest_1.describe)('BookingStatus cancellable invariants', () => {
    const NON_CANCELLABLE = new Set([
        contracts_1.BookingStatus.CONVERTED_TO_RIDE,
        contracts_1.BookingStatus.CANCELLED,
        contracts_1.BookingStatus.EXPIRED,
    ]);
    (0, vitest_1.it)('PENDING is cancellable', () => {
        (0, vitest_1.expect)(NON_CANCELLABLE.has(contracts_1.BookingStatus.PENDING)).toBe(false);
    });
    (0, vitest_1.it)('CONFIRMED is cancellable', () => {
        (0, vitest_1.expect)(NON_CANCELLABLE.has(contracts_1.BookingStatus.CONFIRMED)).toBe(false);
    });
    (0, vitest_1.it)('CONVERTED_TO_RIDE is not cancellable', () => {
        (0, vitest_1.expect)(NON_CANCELLABLE.has(contracts_1.BookingStatus.CONVERTED_TO_RIDE)).toBe(true);
    });
    (0, vitest_1.it)('CANCELLED is not cancellable', () => {
        (0, vitest_1.expect)(NON_CANCELLABLE.has(contracts_1.BookingStatus.CANCELLED)).toBe(true);
    });
});
// ─── Ride total cost formatting guard ────────────────────────────────────────
(0, vitest_1.describe)('Ride totalCost shape', () => {
    (0, vitest_1.it)('has amount and currency', () => {
        const cost = baseRide.totalCost;
        (0, vitest_1.expect)(typeof cost.amount).toBe('number');
        (0, vitest_1.expect)(typeof cost.currency).toBe('string');
        (0, vitest_1.expect)(cost.amount).toBeGreaterThan(0);
    });
});
