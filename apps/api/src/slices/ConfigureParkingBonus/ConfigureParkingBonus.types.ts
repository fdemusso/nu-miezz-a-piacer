import type { Money, ParkingBonusRule } from '@vsa/contracts'

export interface ConfigureParkingBonusRequest {
  zoneId: string
  bonusAmount: Money
  description: string
}

export interface ConfigureParkingBonusResponse {
  rule: ParkingBonusRule
}
