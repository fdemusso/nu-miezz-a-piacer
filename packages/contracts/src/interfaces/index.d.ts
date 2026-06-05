import { Coordinates, Vehicle, Booking, Ride, Money, FleetZone } from '../types';
import { VehicleStatus, BookingStatus, RideStatus, UserRole } from '../enums';
export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}
export interface IVehicleRepository {
    findById(id: string): Promise<Vehicle | null>;
    findNearby(coords: Coordinates, radiusKm: number): Promise<Vehicle[]>;
    updateStatus(id: string, status: VehicleStatus): Promise<void>;
    updateLocation(id: string, location: Coordinates): Promise<void>;
}
export interface IBookingRepository {
    findById(id: string): Promise<Booking | null>;
    findActiveByUserId(userId: string): Promise<Booking | null>;
    create(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking>;
    updateStatus(id: string, status: BookingStatus): Promise<void>;
}
export interface IRideRepository {
    findById(id: string): Promise<Ride | null>;
    findActiveByUserId(userId: string): Promise<Ride | null>;
    create(data: Omit<Ride, 'id'>): Promise<Ride>;
    updateStatus(id: string, status: RideStatus): Promise<void>;
    end(id: string, data: Pick<Ride, 'endedAt' | 'endLocation' | 'distanceKm' | 'durationMinutes' | 'totalCost'>): Promise<Ride>;
}
export interface IUnlockService {
    unlock(vehicleId: string, rideId: string): Promise<{
        success: boolean;
        unlockCode?: string;
    }>;
    lock(vehicleId: string, rideId: string): Promise<{
        success: boolean;
    }>;
}
export interface IZoneValidator {
    isInServiceZone(coords: Coordinates): Promise<boolean>;
    isInParkingZone(coords: Coordinates): Promise<{
        valid: boolean;
        zoneId?: string;
    }>;
}
export interface IFleetZoneRepository {
    findAll(): Promise<FleetZone[]>;
    findById(id: string): Promise<FleetZone | null>;
}
export interface IGpsTrackingService {
    getCurrentPosition(vehicleId: string): Promise<Coordinates | null>;
    resolveUserPosition(provided: Coordinates | null): Promise<Coordinates>;
}
export interface IBillingService {
    calculateRideCost(startedAt: Date, endedAt: Date, distanceKm: number, pricing: import('../types').PricingPlan): Promise<Money>;
    chargeUser(userId: string, amount: Money, rideId: string): Promise<{
        transactionId: string;
    }>;
}
