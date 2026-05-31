import type { IVehicleRepository, IRoutingService, IZoneValidator, IPricingService } from '@vsa/contracts'
import type { SuggestBestVehicleRequest, SuggestBestVehicleResponse } from './SuggestBestVehicle.types'

export function makeSuggestBestVehicleHandler(deps: {
  vehicleRepo: IVehicleRepository
  routingService: IRoutingService
  zoneValidator: IZoneValidator
  pricingService: IPricingService
}) {
  return async function suggestBestVehicleHandler(
    req: SuggestBestVehicleRequest
  ): Promise<SuggestBestVehicleResponse> {
    return {} as SuggestBestVehicleResponse
  }
}
