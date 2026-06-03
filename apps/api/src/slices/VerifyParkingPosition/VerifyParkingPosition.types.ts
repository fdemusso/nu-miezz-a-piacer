import type { Coordinates } from '@vsa/contracts'

export interface VerifyParkingPositionRequest {
  vehicleId: string
}

export interface VerifyParkingPositionResponse {
  vehicleId: string
  position: Coordinates
  valid: boolean
  reason: string | null
}
