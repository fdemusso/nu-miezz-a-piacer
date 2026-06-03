import type { VehicleType, VehicleStatus } from '@vsa/contracts'

export interface FleetDistributionMapRequest {}

export interface FleetDistributionZoneEntry {
  zoneId: string
  name: string
  count: number
  vehicles: Array<{
    id: string
    type: VehicleType
    status: VehicleStatus
    batteryLevel: number
  }>
}

export interface FleetDistributionMapResponse {
  zones: FleetDistributionZoneEntry[]
}
