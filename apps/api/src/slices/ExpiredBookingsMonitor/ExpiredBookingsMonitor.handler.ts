import type { IBookingRepository } from '@vsa/contracts'
import type { ExpiredBookingsMonitorRequest, ExpiredBookingsMonitorResponse } from './ExpiredBookingsMonitor.types'

export function makeExpiredBookingsMonitorHandler(deps: {
  bookingRepo: IBookingRepository
}) {
  return async function expiredBookingsMonitorHandler(
    req: ExpiredBookingsMonitorRequest
  ): Promise<ExpiredBookingsMonitorResponse> {
    return {} as ExpiredBookingsMonitorResponse
  }
}
