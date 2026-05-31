import type { IIncentiveService } from '@vsa/contracts'
import type { ConfigureParkingBonusRequest, ConfigureParkingBonusResponse } from './ConfigureParkingBonus.types'

export function makeConfigureParkingBonusHandler(deps: {
  incentiveService: IIncentiveService
}) {
  return async function configureParkingBonusHandler(
    req: ConfigureParkingBonusRequest
  ): Promise<ConfigureParkingBonusResponse> {
    return {} as ConfigureParkingBonusResponse
  }
}
