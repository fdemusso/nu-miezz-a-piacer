import type { PaymentMethod } from '@vsa/contracts'

export interface ManagePaymentMethodRequest {
  action: 'add' | 'remove' | 'list'
  userId: string
  method?: PaymentMethod
  methodId?: string
}

export interface ManagePaymentMethodResponse {
  methods?: PaymentMethod[]
}
