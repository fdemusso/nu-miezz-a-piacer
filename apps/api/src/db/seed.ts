import { VehicleType, VehicleStatus, UserRole } from '@mvp/contracts';
import type { Db } from './index';
import { vehicles, users } from './schema';

const DEMO_VEHICLES = [
  {
    id: 'v1',
    type: VehicleType.SCOOTER,
    status: VehicleStatus.AVAILABLE,
    lat: 45.467,
    lng: 9.1865,
    batteryLevel: 85,
    batteryRangeKm: 51,
    model: 'Niu N1S',
    licensePlate: 'EL-001',
    specsJson: JSON.stringify({ maxSpeedKmh: 45, weightKg: 28, maxRangeKm: 60 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: false, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 1, currency: 'EUR' }, perMinuteRate: { amount: 0.25, currency: 'EUR' } }),
  },
  {
    id: 'v2',
    type: VehicleType.BIKE,
    status: VehicleStatus.AVAILABLE,
    lat: 45.4638,
    lng: 9.1872,
    batteryLevel: 100,
    batteryRangeKm: 60,
    model: 'Trek FX3',
    licensePlate: null,
    specsJson: JSON.stringify({ maxSpeedKmh: 30, weightKg: 12, maxRangeKm: 60 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: false, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 0.5, currency: 'EUR' }, perMinuteRate: { amount: 0.15, currency: 'EUR' } }),
  },
  {
    id: 'v3',
    type: VehicleType.SCOOTER,
    status: VehicleStatus.AVAILABLE,
    lat: 45.4665,
    lng: 9.1835,
    batteryLevel: 62,
    batteryRangeKm: 37,
    model: 'Niu N1S',
    licensePlate: 'EL-003',
    specsJson: JSON.stringify({ maxSpeedKmh: 45, weightKg: 28, maxRangeKm: 60 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: false, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 1, currency: 'EUR' }, perMinuteRate: { amount: 0.25, currency: 'EUR' } }),
  },
  {
    id: 'v4',
    type: VehicleType.MOPED,
    status: VehicleStatus.AVAILABLE,
    lat: 45.4628,
    lng: 9.1895,
    batteryLevel: 78,
    batteryRangeKm: 58,
    model: 'Honda PCX',
    licensePlate: 'EL-004',
    specsJson: JSON.stringify({ maxSpeedKmh: 60, weightKg: 130, maxRangeKm: 75 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: true, hasUsb: true, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 1.5, currency: 'EUR' }, perMinuteRate: { amount: 0.3, currency: 'EUR' } }),
  },
  {
    id: 'v5',
    type: VehicleType.SCOOTER,
    status: VehicleStatus.IN_USE,
    lat: 45.468,
    lng: 9.182,
    batteryLevel: 45,
    batteryRangeKm: 27,
    model: 'Niu N1S',
    licensePlate: 'EL-005',
    specsJson: JSON.stringify({ maxSpeedKmh: 45, weightKg: 28, maxRangeKm: 60 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: false, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 1, currency: 'EUR' }, perMinuteRate: { amount: 0.25, currency: 'EUR' } }),
  },
  {
    id: 'v6',
    type: VehicleType.BIKE,
    status: VehicleStatus.AVAILABLE,
    lat: 45.47,
    lng: 9.186,
    batteryLevel: 100,
    batteryRangeKm: 60,
    model: 'Trek FX3',
    licensePlate: null,
    specsJson: JSON.stringify({ maxSpeedKmh: 30, weightKg: 12, maxRangeKm: 60 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: false, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 0.5, currency: 'EUR' }, perMinuteRate: { amount: 0.15, currency: 'EUR' } }),
  },
  {
    id: 'v7',
    type: VehicleType.SCOOTER,
    status: VehicleStatus.MAINTENANCE,
    lat: 45.461,
    lng: 9.1845,
    batteryLevel: 10,
    batteryRangeKm: 6,
    model: 'Niu N1S',
    licensePlate: 'EL-007',
    specsJson: JSON.stringify({ maxSpeedKmh: 45, weightKg: 28, maxRangeKm: 60 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: false, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 1, currency: 'EUR' }, perMinuteRate: { amount: 0.25, currency: 'EUR' } }),
  },
  {
    id: 'v8',
    type: VehicleType.CAR,
    status: VehicleStatus.AVAILABLE,
    lat: 45.4715,
    lng: 9.187,
    batteryLevel: 88,
    batteryRangeKm: 211,
    model: 'Fiat 500e',
    licensePlate: 'EL-008',
    specsJson: JSON.stringify({ maxSpeedKmh: 150, weightKg: 1360, maxRangeKm: 240 }),
    featuresJson: JSON.stringify({ hasGps: true, hasHelmetStorage: false, hasUsb: true, hasLock: true }),
    pricingJson: JSON.stringify({ unlockFee: { amount: 2, currency: 'EUR' }, perMinuteRate: { amount: 0.5, currency: 'EUR' } }),
  },
];

const DEMO_USERS = [
  {
    id: 'u1',
    email: 'demo@mvp.local',
    role: UserRole.RIDER,
    createdAt: new Date(),
  },
];

export async function seedDemoData(db: Db): Promise<void> {
  const existing = await db.select({ id: vehicles.id }).from(vehicles).limit(1);
  if (existing.length > 0) return;

  for (const v of DEMO_VEHICLES) {
    await db.insert(vehicles).values(v).onConflictDoNothing();
  }

  for (const u of DEMO_USERS) {
    await db.insert(users).values(u).onConflictDoNothing();
  }

  console.log('[seed] Demo data inserted');
}
