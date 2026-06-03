import type { CostEstimate } from '@vsa/contracts'

export interface EstimateRideCostRequest {
  vehicleId: string
  durationSeconds: string
  promoCode?: string
}

export type EstimateRideCostResponse = CostEstimate
