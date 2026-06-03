import type { VehiclePositionSnapshot } from '@vsa/contracts'

export interface VehicleGPSHistoryRequest {
  vehicleId: string
  from: string
  to: string
}

export interface VehicleGPSHistoryResponse {
  vehicleId: string
  history: VehiclePositionSnapshot[]
}
