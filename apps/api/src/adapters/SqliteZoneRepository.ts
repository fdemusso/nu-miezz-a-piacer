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

export class SqliteZoneRepository implements IZoneRepository {
  async findById(zoneId: string): Promise<ZoneRule | null> { return null }

  async findActiveByPosition(position: Coordinates): Promise<ZoneRule[]> { return [] }

  async findByType(type: ZoneType): Promise<ZoneRule[]> { return [] }

  async save(zone: ZoneRule): Promise<void> { }

  async update(zone: ZoneRule): Promise<void> { }

  async deactivate(zoneId: string): Promise<void> { }
}
