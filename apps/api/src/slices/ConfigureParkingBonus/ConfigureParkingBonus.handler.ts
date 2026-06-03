import type { IIncentiveService, IFleetZoneRepository } from '@vsa/contracts'
import type { ConfigureParkingBonusRequest, ConfigureParkingBonusResponse } from './ConfigureParkingBonus.types'

export function makeConfigureParkingBonusHandler(deps: {
  incentiveService: IIncentiveService
  fleetZoneRepo: IFleetZoneRepository
}) {
  return async function configureParkingBonusHandler(
    req: ConfigureParkingBonusRequest
  ): Promise<ConfigureParkingBonusResponse> {
    const zone = await deps.fleetZoneRepo.findById(req.zoneId)
    if (!zone) throw Object.assign(new Error('Zone not found'), { status: 404 })

    if (req.bonusAmount.amount <= 0) {
      throw Object.assign(new Error('bonusAmount must be positive'), { status: 400 })
    }

    const rule = {
      id: crypto.randomUUID(),
      zoneId: req.zoneId,
      bonusAmount: req.bonusAmount,
      description: req.description,
    }

    await deps.incentiveService.configureBonusRule(rule)

    return { rule }
  }
}
