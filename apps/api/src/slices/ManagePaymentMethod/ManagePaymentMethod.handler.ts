import type { IUserRepository, IBillingService } from '@vsa/contracts'
import type { ManagePaymentMethodRequest, ManagePaymentMethodResponse } from './ManagePaymentMethod.types'

export function makeManagePaymentMethodHandler(deps: {
  userRepo: IUserRepository
  billingService: IBillingService
}) {
  return async function managePaymentMethodHandler(
    req: ManagePaymentMethodRequest
  ): Promise<ManagePaymentMethodResponse> {
    return {} as ManagePaymentMethodResponse
  }
}
