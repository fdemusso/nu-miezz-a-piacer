import type { WalkEstimate } from '@vsa/contracts'

export interface EstimateWalkTimeRequest {
  fromLat: string
  fromLng: string
  vehicleId: string
}

export type EstimateWalkTimeResponse = WalkEstimate
