export interface ReportDamagedVehicleRequest {
  vehicleId: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface ReportDamagedVehicleResponse {
  reported: boolean
  maintenanceRequired: boolean
}
