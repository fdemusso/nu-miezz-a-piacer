import type { IZoneValidator, IGpsTrackingService, IVehicleRepository, IZoneRepository } from '@vsa/contracts'
import type { VerifyParkingPositionRequest, VerifyParkingPositionResponse } from './VerifyParkingPosition.types'

export function makeVerifyParkingPositionHandler(deps: {
  zoneValidator: IZoneValidator
  gpsTrackingService: IGpsTrackingService
  vehicleRepo: IVehicleRepository
  zoneRepo: IZoneRepository
}) {
  return async function verifyParkingPositionHandler(
    req: VerifyParkingPositionRequest
  ): Promise<VerifyParkingPositionResponse> {
    const { vehicleId } = req

    const vehicle = await deps.vehicleRepo.findById(vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    let position = vehicle.position
    try {
      position = await deps.gpsTrackingService.getPosition(vehicleId)
    } catch {
      // GPS not available — fall back to last known vehicle position
    }

    const zones = await deps.zoneRepo.findAll()
    const validation = deps.zoneValidator.validate(position, zones)

    return {
      vehicleId,
      position,
      valid: validation.valid,
      reason: validation.reason ?? null,
    }
  }
}
