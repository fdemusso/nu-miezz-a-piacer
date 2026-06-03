export interface LowAvailabilityAlertRequest {}

export interface LowAvailabilityAlertZone {
  id: string
  name: string
  vehicleCount: number
  targetCount: number
}

export interface LowAvailabilityAlertResponse {
  alertsSent: number
  zones: LowAvailabilityAlertZone[]
}
