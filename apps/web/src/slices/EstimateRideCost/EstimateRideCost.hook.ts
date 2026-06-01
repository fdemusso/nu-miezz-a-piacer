import { useState, useCallback } from 'react'
import type { VehicleType } from '@vsa/contracts'
import type { EstimateRideCostViewState, VehiclePricing } from './EstimateRideCost.types'

const MOCK_PRICING: Record<VehicleType, VehiclePricing> = {
  scooter: {
    unlockCost: { amount: 1.00, currency: 'EUR' },
    perMinuteCost: { amount: 0.25, currency: 'EUR' },
  },
  bike: {
    unlockCost: { amount: 0.50, currency: 'EUR' },
    perMinuteCost: { amount: 0.10, currency: 'EUR' },
  },
  ebike: {
    unlockCost: { amount: 0.80, currency: 'EUR' },
    perMinuteCost: { amount: 0.18, currency: 'EUR' },
  },
  car: {
    unlockCost: { amount: 2.00, currency: 'EUR' },
    perMinuteCost: { amount: 0.35, currency: 'EUR' },
  },
}

export function useEstimateRideCost(): EstimateRideCostViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  const getPricing = useCallback((type: VehicleType): VehiclePricing => {
    return MOCK_PRICING[type] || {
      unlockCost: { amount: 1.00, currency: 'EUR' },
      perMinuteCost: { amount: 0.25, currency: 'EUR' },
    }
  }, [])

  return {
    loading,
    error,
    getPricing,
  }
}
