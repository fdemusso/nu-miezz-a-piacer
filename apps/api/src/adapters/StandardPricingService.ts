import type {
  Vehicle, VehicleType, CostEstimate, IPricingService,
} from '@vsa/contracts'

const UNLOCK_FEE_EUR: Record<VehicleType, number> = {
  scooter: 1.0, bike: 0.5, ebike: 1.0, car: 2.5,
}
const PER_MINUTE_EUR: Record<VehicleType, number> = {
  scooter: 0.25, bike: 0.10, ebike: 0.20, car: 0.40,
}

export class StandardPricingService implements IPricingService {
  async estimateCost(vehicle: Vehicle, durationSeconds: number): Promise<CostEstimate> {
    const minutes = Math.max(1, Math.ceil(durationSeconds / 60))
    const unlock = UNLOCK_FEE_EUR[vehicle.type]
    const usage = PER_MINUTE_EUR[vehicle.type] * minutes
    const round = (n: number) => Math.round(n * 100) / 100
    return {
      baseCost: { amount: round(unlock), currency: 'EUR' },
      estimatedTotal: { amount: round(unlock + usage), currency: 'EUR' },
      currency: 'EUR',
    }
  }
}
