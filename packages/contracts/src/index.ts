export { sliceRegistry, getVisibleSlices } from './sliceRegistry'

// ── Domain types ──────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin' | 'operator'
export type VehicleType = 'scooter' | 'bike' | 'ebike' | 'car'
export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'reserved'
export type ZoneType = 'parking' | 'forbidden' | 'sensitive' | 'incentive'
export type UnlockMethodType = 'qr' | 'nfc' | 'pin' | 'app'

export interface Coordinates { lat: number; lng: number }
export interface GeoPoint { lat: number; lng: number }
export interface Money { amount: number; currency: string }
export interface PricingPlan { unlockCost: number; perMinuteCost: number }
export interface TimeRange { from: Date; to: Date }

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  suspended: boolean
}

export interface Customer extends User {
  paymentMethods: PaymentMethod[]
}

export interface PaymentMethod {
  id: string
  type: string
  last4?: string
  isDefault: boolean
}

export interface Vehicle {
  id: string
  type: VehicleType
  status: VehicleStatus
  batteryLevel: number
  position: Coordinates
  licensePlate: string
}

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  createdAt: Date
  expiresAt: Date
  status: 'active' | 'expired' | 'converted'
}

export interface Ride {
  id: string
  userId: string
  vehicleId: string
  startedAt: Date
  endedAt?: Date
  startPosition: Coordinates
  endPosition?: Coordinates
  cost?: Money
  paused: boolean
}

export interface ZoneRule {
  id: string
  type: ZoneType
  name: string
  boundary: GeoPoint[]
}

export interface FleetZone {
  id: string
  name: string
  boundary: GeoPoint[]
  vehicleCount: number
  targetCount: number
}

export interface VehicleConditionReport {
  vehicleId: string
  reportedAt: Date
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  body: string
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: Date
}

export interface ParkingBonusRule {
  id: string
  zoneId: string
  bonusAmount: Money
  description: string
}

export interface Promotion {
  id: string
  code: string
  discountPercent: number
  validUntil: Date
}

export interface VehiclePositionSnapshot {
  vehicleId: string
  position: Coordinates
  recordedAt: Date
  batteryLevel: number
}

export interface WalkEstimate {
  distanceMeters: number
  durationSeconds: number
}

export interface RouteEstimate {
  distanceMeters: number
  durationSeconds: number
}

export interface CostEstimate {
  baseCost: Money
  estimatedTotal: Money
  currency: string
}

export interface ParkingValidationResult {
  valid: boolean
  reason?: string
}

export interface MobilityReport {
  period: TimeRange
  totalRides: number
  totalDistance: number
  activeUsers: number
}

// ── Repository interfaces ─────────────────────────────────────────────────────

export interface IUserRepository {
  findById(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
}

export interface IVehicleRepository {
  findById(vehicleId: string): Promise<Vehicle | null>
  findNearby(position: Coordinates, radiusMeters: number): Promise<Vehicle[]>
  findAll(): Promise<Vehicle[]>
  save(vehicle: Vehicle): Promise<void>
}

export interface IBookingRepository {
  findById(bookingId: string): Promise<Booking | null>
  findActiveByUser(userId: string): Promise<Booking[]>
  findExpired(): Promise<Booking[]>
  save(booking: Booking): Promise<void>
}

export interface IRideRepository {
  findById(rideId: string): Promise<Ride | null>
  findActiveByUser(userId: string): Promise<Ride | null>
  findAll(): Promise<Ride[]>
  save(ride: Ride): Promise<void>
}

export interface IZoneRepository {
  findAll(): Promise<ZoneRule[]>
  save(zone: ZoneRule): Promise<void>
}

export interface IFleetZoneRepository {
  findAll(): Promise<FleetZone[]>
  findById(zoneId: string): Promise<FleetZone | null>
  save(zone: FleetZone): Promise<void>
}

// ── Service interfaces ────────────────────────────────────────────────────────

export interface IAuthService {
  authenticate(email: string, password: string): Promise<User>
  suspendUser(userId: string): Promise<void>
}

export interface IZoneValidator {
  isInsideZone(position: Coordinates, zone: ZoneRule | FleetZone): boolean
  validate(position: Coordinates, zones: ZoneRule[]): ParkingValidationResult
}

export interface IRoutingService {
  estimateWalk(from: Coordinates, to: Coordinates): Promise<WalkEstimate>
  estimateRoute(from: Coordinates, to: Coordinates): Promise<RouteEstimate>
}

export interface IPricingService {
  estimateCost(vehicle: Vehicle, durationSeconds: number): Promise<CostEstimate>
}

export interface IBillingService {
  charge(userId: string, amount: Money): Promise<void>
  addPaymentMethod(userId: string, method: PaymentMethod): Promise<void>
  removePaymentMethod(userId: string, methodId: string): Promise<void>
  listPaymentMethods(userId: string): Promise<PaymentMethod[]>
}

export interface IPromotionService {
  apply(code: string, cost: CostEstimate): Promise<CostEstimate>
  validate(code: string): Promise<Promotion | null>
}

export interface IIncentiveService {
  applyParkingBonus(userId: string, zoneId: string): Promise<void>
  configureBonusRule(rule: ParkingBonusRule): Promise<void>
}

export interface INotificationSender {
  send(userId: string, title: string, body: string): Promise<void>
  broadcast(userIds: string[], title: string, body: string): Promise<void>
}

export interface IUnlockService {
  unlock(vehicleId: string, method: UnlockMethodType): Promise<void>
  lock(vehicleId: string): Promise<void>
  getAvailableMethods(vehicle: Vehicle): Promise<UnlockMethodType[]>
}

export interface IGpsTrackingService {
  getPosition(vehicleId: string): Promise<Coordinates>
  getHistory(vehicleId: string, range: TimeRange): Promise<VehiclePositionSnapshot[]>
}

export interface IMaintenanceService {
  reportDamage(report: VehicleConditionReport): Promise<void>
  getQueue(): Promise<VehicleConditionReport[]>
  receiveMalfunction(vehicleId: string, description: string): Promise<void>
}

export interface ISupportService {
  openTicket(userId: string, subject: string, body: string): Promise<SupportTicket>
  listTickets(): Promise<SupportTicket[]>
  getTicketsByUser(userId: string): Promise<SupportTicket[]>
  updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<SupportTicket>
}

export interface IReportingService {
  getUsageFrequency(range: TimeRange): Promise<Record<string, number>>
  getMobilityReport(range: TimeRange): Promise<MobilityReport>
  getHighDensityZones(): Promise<FleetZone[]>
}
