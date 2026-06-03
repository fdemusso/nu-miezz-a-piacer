import type { IPromotionService } from '@vsa/contracts'
import type { ApplyPromotionRequest, ApplyPromotionResponse } from './ApplyPromotion.types'

export function makeApplyPromotionHandler(deps: { promotionService: IPromotionService }) {
  return async function applyPromotionHandler(
    req: ApplyPromotionRequest
  ): Promise<ApplyPromotionResponse> {
    const promotion = await deps.promotionService.validate(req.code)
    return { promotion }
  }
}
