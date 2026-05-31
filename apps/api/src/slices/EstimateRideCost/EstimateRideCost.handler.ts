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
    return {} as EstimateRideCostResponse
  }
}
