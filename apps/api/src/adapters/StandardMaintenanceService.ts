import type { VehicleConditionReport, IMaintenanceService } from '@vsa/contracts'

const SEVERITY_ORDER: Record<VehicleConditionReport['severity'], number> = {
  high: 0, medium: 1, low: 2,
}

export class StandardMaintenanceService implements IMaintenanceService {
  private queue: VehicleConditionReport[] = []

  async reportDamage(report: VehicleConditionReport): Promise<void> {
    this.queue.push(report)
  }

  async receiveMalfunction(vehicleId: string, description: string): Promise<void> {
    this.queue.push({
      vehicleId,
      reportedAt: new Date(),
      description,
      severity: 'medium',
    })
  }

  async getQueue(): Promise<VehicleConditionReport[]> {
    return [...this.queue].sort(
      (a, b) =>
        SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
        a.reportedAt.getTime() - b.reportedAt.getTime(),
    )
  }
}
