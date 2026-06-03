import type { IVehicleRepository, IPricingService, IPromotionService } from '@vsa/contracts'
import type { EstimateRideCostRequest, EstimateRideCostResponse } from './EstimateRideCost.types'

export function makeEstimateRideCostHandler(deps: {
  vehicleRepo: IVehicleRepository
  pricingService: IPricingService
  promotionService: IPromotionService
}) {
  return async function estimateRideCostHandler(
    req: EstimateRideCostRequest
  ): Promise<EstimateRideCostResponse> {
    const vehicle = await deps.vehicleRepo.findById(req.vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })
    const cost = await deps.pricingService.estimateCost(vehicle, parseFloat(req.durationSeconds))
    if (req.promoCode) return deps.promotionService.apply(req.promoCode, cost)
    return cost
  }
}
