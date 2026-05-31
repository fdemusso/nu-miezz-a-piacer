import type { ISupportService, IUserRepository } from '@vsa/contracts'
import type { ManageSupportTicketsRequest, ManageSupportTicketsResponse } from './ManageSupportTickets.types'

export function makeManageSupportTicketsHandler(deps: {
  supportService: ISupportService
  userRepo: IUserRepository
}) {
  return async function manageSupportTicketsHandler(
    req: ManageSupportTicketsRequest
  ): Promise<ManageSupportTicketsResponse> {
    return {} as ManageSupportTicketsResponse
  }
}
