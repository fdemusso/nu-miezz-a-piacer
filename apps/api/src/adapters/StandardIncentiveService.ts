import type { ParkingBonusRule, IIncentiveService } from '@vsa/contracts'

interface BonusGrant { userId: string; zoneId: string; at: Date }

export class StandardIncentiveService implements IIncentiveService {
  private rulesByZone = new Map<string, ParkingBonusRule>()
  private grants: BonusGrant[] = []

  async configureBonusRule(rule: ParkingBonusRule): Promise<void> {
    this.rulesByZone.set(rule.zoneId, rule)
  }

  async applyParkingBonus(userId: string, zoneId: string): Promise<void> {
    if (!this.rulesByZone.has(zoneId)) return
    this.grants.push({ userId, zoneId, at: new Date() })
  }

  getGrantsForTest(): BonusGrant[] { return [...this.grants] }
}
