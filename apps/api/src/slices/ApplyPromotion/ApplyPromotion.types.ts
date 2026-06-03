import type { Promotion } from '@vsa/contracts'

export interface ApplyPromotionRequest {
  code: string
}

export interface ApplyPromotionResponse {
  promotion: Promotion | null
}
