import type { CostEstimate } from '@vsa/contracts'

export interface EndRideRequest {
  userId: string
  endLat: number
  endLng: number
}

export interface EndRideResponse {
  rideId: string
  cost: CostEstimate
}
