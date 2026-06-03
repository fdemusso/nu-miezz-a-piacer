import type { IUserRepository, IBillingService } from '@vsa/contracts'
import type { ManagePaymentMethodRequest, ManagePaymentMethodResponse } from './ManagePaymentMethod.types'

export function makeManagePaymentMethodHandler(deps: {
  userRepo: IUserRepository
  billingService: IBillingService
}) {
  return async function managePaymentMethodHandler(
    req: ManagePaymentMethodRequest
  ): Promise<ManagePaymentMethodResponse> {
    switch (req.action) {
      case 'add': {
        if (!req.method) throw Object.assign(new Error('method required'), { status: 400 })
        await deps.billingService.addPaymentMethod(req.userId, req.method)
        return {}
      }
      case 'remove': {
        if (!req.methodId) throw Object.assign(new Error('methodId required'), { status: 400 })
        await deps.billingService.removePaymentMethod(req.userId, req.methodId)
        return {}
      }
      case 'list': {
        const methods = await deps.billingService.listPaymentMethods(req.userId)
        return { methods }
      }
      default:
        throw Object.assign(new Error('Invalid action'), { status: 400 })
    }
  }
}
