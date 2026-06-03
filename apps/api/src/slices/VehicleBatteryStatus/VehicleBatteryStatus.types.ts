export interface VehicleBatteryStatusRequest {
  vehicleId: string
}

export interface VehicleBatteryStatusResponse {
  batteryLevel: number
  estimatedRangeKm: number
}
