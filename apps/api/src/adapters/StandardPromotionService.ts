import type { CostEstimate, Promotion, IPromotionService } from '@vsa/contracts'

export class StandardPromotionService implements IPromotionService {
  private byCode = new Map<string, Promotion>()

  registerForTest(promotion: Promotion): void {
    this.byCode.set(promotion.code.toUpperCase(), promotion)
  }

  async validate(code: string): Promise<Promotion | null> {
    const p = this.byCode.get(code.toUpperCase())
    if (!p) return null
    return p.validUntil.getTime() >= Date.now() ? p : null
  }

  async apply(code: string, cost: CostEstimate): Promise<CostEstimate> {
    const promo = await this.validate(code)
    if (!promo) return cost
    const factor = 1 - promo.discountPercent / 100
    const round = (n: number) => Math.round(n * 100) / 100
    return {
      ...cost,
      estimatedTotal: {
        amount: round(cost.estimatedTotal.amount * factor),
        currency: cost.estimatedTotal.currency,
      },
    }
  }
}
