export enum UserRole {
  RIDER = 'RIDER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
}

export enum VehicleType {
  SCOOTER = 'SCOOTER',
  BIKE = 'BIKE',
  MOPED = 'MOPED',
  CAR = 'CAR',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE',
}

export enum RideStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}
