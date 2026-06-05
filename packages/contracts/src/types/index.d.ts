import { VehicleType, VehicleStatus, BookingStatus, RideStatus } from '../enums';
export interface FleetZone {
    id: string;
    name: string;
    center: Coordinates;
    radiusKm: number;
}
export interface NearbyVehiclesItem {
    id: string;
    plateOrCode: string;
    type: VehicleType;
    status: VehicleStatus;
    batteryLevel: number;
    distanceMeters: number;
    estimatedWalkMinutes: number;
    currentPosition: Coordinates;
    zoneId?: string;
}
export interface NearbyVehiclesResponse {
    userPosition: Coordinates;
    radiusKm: number;
    vehicles: NearbyVehiclesItem[];
}
export interface Coordinates {
    lat: number;
    lng: number;
}
export interface Money {
    amount: number;
    currency: string;
}
export interface BatteryInfo {
    level: number;
    estimatedRangeKm: number;
}
export interface VehicleSpecs {
    maxSpeedKmh: number;
    weightKg: number;
    maxRangeKm: number;
}
export interface VehicleFeatures {
    hasGps: boolean;
    hasHelmetStorage: boolean;
    hasUsb: boolean;
    hasLock: boolean;
}
export interface PricingPlan {
    unlockFee: Money;
    perMinuteRate: Money;
    perKmRate?: Money;
    pauseRate?: Money;
}
export interface Vehicle {
    id: string;
    type: VehicleType;
    status: VehicleStatus;
    location: Coordinates;
    battery: BatteryInfo;
    specs: VehicleSpecs;
    features: VehicleFeatures;
    pricing: PricingPlan;
    licensePlate?: string;
    model: string;
    imageUrl?: string;
}
export interface Booking {
    id: string;
    userId: string;
    vehicleId: string;
    status: BookingStatus;
    createdAt: Date;
    expiresAt: Date;
    confirmedAt?: Date;
    cancelledAt?: Date;
}
export interface Ride {
    id: string;
    userId: string;
    vehicleId: string;
    bookingId?: string;
    status: RideStatus;
    startedAt: Date;
    endedAt?: Date;
    startLocation: Coordinates;
    endLocation?: Coordinates;
    distanceKm?: number;
    durationMinutes?: number;
    totalCost?: Money;
}
