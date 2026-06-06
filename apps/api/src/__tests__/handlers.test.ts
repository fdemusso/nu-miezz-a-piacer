import { describe, it, expect, vi } from 'vitest';
import { BookingStatus, RideStatus, VehicleStatus, VehicleType, UserRole } from '@mvp/contracts';
import type { Ride, Booking, Vehicle, User } from '@mvp/contracts';
import { createHistoryHandler } from '../slices/History/History.handler';
import { createSearchHandler } from '../slices/Search/Search.handler';
import { createProfileHandler } from '../slices/Profile/Profile.handler';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const baseRide: Ride = {
  id: 'r1',
  userId: 'u1',
  vehicleId: 'v1',
  status: RideStatus.ENDED,
  startedAt: new Date('2024-01-01T10:00:00Z'),
  endedAt: new Date('2024-01-01T10:30:00Z'),
  startLocation: { lat: 45.0, lng: 9.0 },
  endLocation: { lat: 45.1, lng: 9.1 },
  distanceKm: 2.5,
  durationMinutes: 30,
  totalCost: { amount: 3.5, currency: 'EUR' },
};

const baseVehicle: Vehicle = {
  id: 'v1',
  type: VehicleType.SCOOTER,
  status: VehicleStatus.AVAILABLE,
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

const baseUser: User = {
  id: 'u1',
  email: 'test@example.com',
  role: UserRole.RIDER,
  createdAt: new Date('2024-01-01T00:00:00Z'),
};

// ─── History handler ──────────────────────────────────────────────────────────

describe('createHistoryHandler', () => {
  it('returns rides from repo', async () => {
    const rideRepo = { findByUserId: vi.fn().mockResolvedValue([baseRide]) };
    const handler = createHistoryHandler({ rideRepo } as any);
    const result = await handler({ userId: 'u1' });
    expect(result.rides).toHaveLength(1);
    expect(result.rides[0]!.id).toBe('r1');
    expect(rideRepo.findByUserId).toHaveBeenCalledWith('u1');
  });

  it('returns empty array when user has no rides', async () => {
    const rideRepo = { findByUserId: vi.fn().mockResolvedValue([]) };
    const handler = createHistoryHandler({ rideRepo } as any);
    const result = await handler({ userId: 'u2' });
    expect(result.rides).toEqual([]);
  });
});

// ─── Search handler ───────────────────────────────────────────────────────────

describe('createSearchHandler', () => {
  it('maps vehicle to SearchVehicleItem', async () => {
    const vehicleRepo = { search: vi.fn().mockResolvedValue([baseVehicle]) };
    const handler = createSearchHandler({ vehicleRepo } as any);
    const result = await handler({ filters: {} });
    expect(result.total).toBe(1);
    expect(result.vehicles[0]).toMatchObject({
      id: 'v1',
      plateOrCode: 'AB123',
      type: VehicleType.SCOOTER,
      status: VehicleStatus.AVAILABLE,
      model: 'TestModel',
      batteryLevel: 80,
      estimatedRangeKm: 40,
    });
  });

  it('uses type-code fallback when licensePlate is absent', async () => {
    const noPlate: Vehicle = { ...baseVehicle, licensePlate: undefined };
    const vehicleRepo = { search: vi.fn().mockResolvedValue([noPlate]) };
    const handler = createSearchHandler({ vehicleRepo } as any);
    const result = await handler({ filters: {} });
    expect(result.vehicles[0]!.plateOrCode).toMatch(/^SCOOTER-/);
  });

  it('returns empty results when no vehicles match', async () => {
    const vehicleRepo = { search: vi.fn().mockResolvedValue([]) };
    const handler = createSearchHandler({ vehicleRepo } as any);
    const result = await handler({ filters: { onlyAvailable: true } });
    expect(result.total).toBe(0);
    expect(result.vehicles).toEqual([]);
  });
});

// ─── Profile handler ──────────────────────────────────────────────────────────

describe('createProfileHandler', () => {
  it('returns profile for valid user', async () => {
    const userRepo = { findById: vi.fn().mockResolvedValue(baseUser) };
    const handler = createProfileHandler({ userRepo } as any);
    const result = await handler({ userId: 'u1' });
    expect(result.profile.id).toBe('u1');
    expect(result.profile.email).toBe('test@example.com');
  });

  it('throws 404 when user not found', async () => {
    const userRepo = { findById: vi.fn().mockResolvedValue(null) };
    const handler = createProfileHandler({ userRepo } as any);
    await expect(handler({ userId: 'missing' })).rejects.toMatchObject({
      message: 'User not found',
      statusCode: 404,
    });
  });
});

// ─── BookingStatus NON_CANCELLABLE invariant ──────────────────────────────────

describe('BookingStatus cancellable invariants', () => {
  const NON_CANCELLABLE = new Set([
    BookingStatus.CONVERTED_TO_RIDE,
    BookingStatus.CANCELLED,
    BookingStatus.EXPIRED,
  ]);

  it('PENDING is cancellable', () => {
    expect(NON_CANCELLABLE.has(BookingStatus.PENDING)).toBe(false);
  });

  it('CONFIRMED is cancellable', () => {
    expect(NON_CANCELLABLE.has(BookingStatus.CONFIRMED)).toBe(false);
  });

  it('CONVERTED_TO_RIDE is not cancellable', () => {
    expect(NON_CANCELLABLE.has(BookingStatus.CONVERTED_TO_RIDE)).toBe(true);
  });

  it('CANCELLED is not cancellable', () => {
    expect(NON_CANCELLABLE.has(BookingStatus.CANCELLED)).toBe(true);
  });
});

// ─── Ride total cost formatting guard ────────────────────────────────────────

describe('Ride totalCost shape', () => {
  it('has amount and currency', () => {
    const cost = baseRide.totalCost!;
    expect(typeof cost.amount).toBe('number');
    expect(typeof cost.currency).toBe('string');
    expect(cost.amount).toBeGreaterThan(0);
  });
});
