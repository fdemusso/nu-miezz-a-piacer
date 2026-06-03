import type { IAuthService, IUserRepository } from '@vsa/contracts'
import type { SuspendUserAccountRequest, SuspendUserAccountResponse } from './SuspendUserAccount.types'

export function makeSuspendUserAccountHandler(deps: {
  authService: IAuthService
  userRepo: IUserRepository
}) {
  return async function suspendUserAccountHandler(
    req: SuspendUserAccountRequest
  ): Promise<SuspendUserAccountResponse> {
    const { userId } = req

    const user = await deps.userRepo.findById(userId)
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 })

    await deps.authService.suspendUser(userId)
    await deps.userRepo.save({ ...user, suspended: true })

    return { suspended: true, userId }
  }
}
