import type { VehicleConditionReport } from '@vsa/contracts'

export interface MaintenanceQueueRequest {
  // no input needed
}

export interface MaintenanceQueueResponse {
  queue: VehicleConditionReport[]
}
