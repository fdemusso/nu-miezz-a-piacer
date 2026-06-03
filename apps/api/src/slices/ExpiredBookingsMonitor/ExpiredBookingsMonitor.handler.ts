import type { IBookingRepository, IVehicleRepository, INotificationSender } from '@vsa/contracts'
import type { ExpiredBookingsMonitorRequest, ExpiredBookingsMonitorResponse } from './ExpiredBookingsMonitor.types'

export function makeExpiredBookingsMonitorHandler(deps: {
  bookingRepo: IBookingRepository
  vehicleRepo: IVehicleRepository
  notificationSender: INotificationSender
}) {
  return async function expiredBookingsMonitorHandler(
    _req: ExpiredBookingsMonitorRequest
  ): Promise<ExpiredBookingsMonitorResponse> {
    const expired = await deps.bookingRepo.findExpired()

    for (const booking of expired) {
      booking.status = 'expired'

      const vehicle = await deps.vehicleRepo.findById(booking.vehicleId)
      if (vehicle) {
        vehicle.status = 'available'
        await deps.vehicleRepo.save(vehicle)
      }

      await deps.bookingRepo.save(booking)
      await deps.notificationSender.send(
        booking.userId,
        'Prenotazione scaduta',
        'Il tuo veicolo è stato rilasciato.'
      )
    }

    return { swept: expired.length }
  }
}
