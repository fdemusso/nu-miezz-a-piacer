import type { IZoneValidator, IGpsTrackingService, IVehicleRepository } from '@vsa/contracts'
import type { VerifyParkingPositionRequest, VerifyParkingPositionResponse } from './VerifyParkingPosition.types'

export function makeVerifyParkingPositionHandler(deps: {
  zoneValidator: IZoneValidator
  gpsTrackingService: IGpsTrackingService
  vehicleRepo: IVehicleRepository
}) {
  return async function verifyParkingPositionHandler(
    req: VerifyParkingPositionRequest
  ): Promise<VerifyParkingPositionResponse> {
    return {} as VerifyParkingPositionResponse
  }
}
