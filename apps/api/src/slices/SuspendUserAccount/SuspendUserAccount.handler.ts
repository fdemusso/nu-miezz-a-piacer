import type { IAuthService, IUserRepository } from '@vsa/contracts'
import type { SuspendUserAccountRequest, SuspendUserAccountResponse } from './SuspendUserAccount.types'

export function makeSuspendUserAccountHandler(deps: {
  authService: IAuthService
  userRepo: IUserRepository
}) {
  return async function suspendUserAccountHandler(
    req: SuspendUserAccountRequest
  ): Promise<SuspendUserAccountResponse> {
    return {} as SuspendUserAccountResponse
  }
}
