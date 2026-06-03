import type { IMaintenanceService, IVehicleRepository, INotificationSender } from '@vsa/contracts'
import type { ReportDamagedVehicleRequest, ReportDamagedVehicleResponse } from './ReportDamagedVehicle.types'

export function makeReportDamagedVehicleHandler(deps: {
  maintenanceService: IMaintenanceService
  vehicleRepo: IVehicleRepository
  notificationSender: INotificationSender
}) {
  return async function reportDamagedVehicleHandler(
    req: ReportDamagedVehicleRequest
  ): Promise<ReportDamagedVehicleResponse> {
    const { vehicleId, description, severity } = req

    const vehicle = await deps.vehicleRepo.findById(vehicleId)
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 })

    const report = {
      vehicleId,
      reportedAt: new Date(),
      description,
      severity,
    }

    await deps.maintenanceService.reportDamage(report)

    if (severity === 'high') {
      vehicle.status = 'maintenance'
      await deps.vehicleRepo.save(vehicle)
      await deps.notificationSender.send(
        'u-operator-1',
        'Danno grave',
        `Veicolo ${vehicleId}: ${description}`
      )
    }

    return { reported: true, maintenanceRequired: severity === 'high' }
  }
}
