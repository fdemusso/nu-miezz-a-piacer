import type { UserRole } from './index'

export const sliceRegistry: Record<string, { roles: UserRole[] }> = {
  // Customer
  NearbyVehicles:          { roles: ['customer'] },
  BookVehicle:             { roles: ['customer'] },
  EstimateRideCost:        { roles: ['customer'] },
  EndRide:                 { roles: ['customer'] },
  RideSummary:             { roles: ['customer'] },
  VehicleDetails:          { roles: ['customer'] },
  EstimateWalkTime:        { roles: ['customer'] },
  SuggestBestVehicle:      { roles: ['customer'] },
  ApplyPromotion:          { roles: ['customer'] },
  OpenSupportTicket:       { roles: ['customer'] },
  ReportDamagedVehicle:    { roles: ['customer'] },
  VehicleBatteryStatus:    { roles: ['customer'] },
  UnlockVehicle:           { roles: ['customer'] },
  UnlockMethod:            { roles: ['customer'] },
  StartRide:               { roles: ['customer'] },
  ActiveRide:              { roles: ['customer'] },
  ManagePaymentMethod:     { roles: ['customer'] },
  PauseRide:               { roles: ['customer'] },

  // Operator
  FleetDistributionMap:    { roles: ['operator'] },
  LowAvailabilityAlert:    { roles: ['operator'] },
  ReceiveMalfunctionReport:{ roles: ['operator'] },
  VerifyParkingPosition:   { roles: ['operator'] },
  MaintenanceQueue:        { roles: ['operator'] },
  VehicleGPSHistory:       { roles: ['operator'] },
  ManageSupportTickets:    { roles: ['operator'] },
  ConfigureParkingBonus:   { roles: ['operator'] },
  SuspendUserAccount:      { roles: ['operator'] },
  RemoteLockVehicle:       { roles: ['operator'] },
  ExpiredBookingsMonitor:  { roles: ['operator'] },

  // PublicAdministrationUser
  UsageFrequencyReport:    { roles: ['admin'] },
  MobilityPeriodicReport:  { roles: ['admin'] },
  MarkUrbanWarningZone:    { roles: ['admin'] },
  HighDensityZoneMap:      { roles: ['admin'] },
  DefineSensitiveZone:     { roles: ['admin'] },
}

export function getVisibleSlices(role: UserRole): string[] {
  return Object.entries(sliceRegistry)
    .filter(([, cfg]) => cfg.roles.includes(role))
    .map(([name]) => name)
}
