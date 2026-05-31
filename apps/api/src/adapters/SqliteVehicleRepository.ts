import type {
  User, Vehicle, Booking, Ride, ZoneRule, ZoneType, FleetZone, Coordinates,
  VehicleConditionReport, SupportTicket, ParkingBonusRule, GeoPoint,
  VehiclePositionSnapshot, VehicleStatus, Customer, Promotion, PaymentMethod,
  WalkEstimate, RouteEstimate, CostEstimate, ParkingValidationResult, Money,
  MobilityReport, TimeRange, VehicleType, UnlockMethodType, UserRole,
  IUserRepository, IVehicleRepository, IBookingRepository, IRideRepository,
  IZoneRepository, IFleetZoneRepository, IAuthService, IZoneValidator,
  IRoutingService, IPricingService, IBillingService, IPromotionService,
  IIncentiveService, INotificationSender, IUnlockService, IGpsTrackingService,
  IMaintenanceService, ISupportService, IReportingService,
} from '@vsa/contracts'

export class SqliteVehicleRepository implements IVehicleRepository {
  async findById(vehicleId: string): Promise<Vehicle | null> { return null }

  async findNearby(position: Coordinates, radiusMeters: number): Promise<Vehicle[]> { return [] }

  async findAvailableByZone(zoneId: string): Promise<Vehicle[]> { return [] }

  async findAll(): Promise<Vehicle[]> { return [] }

  async save(vehicle: Vehicle): Promise<void> { }

  async update(vehicle: Vehicle): Promise<void> { }
}
