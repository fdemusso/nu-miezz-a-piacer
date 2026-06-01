import type { VehicleType, Money } from '@vsa/contracts'

export interface VehiclePricing {
  unlockCost: Money
  perMinuteCost: Money
}

export interface EstimateRideCostViewState {
  loading: boolean
  error: string | null
  getPricing: (type: VehicleType) => VehiclePricing
}
