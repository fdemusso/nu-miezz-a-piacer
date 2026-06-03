import type { VehicleConditionReport } from '@vsa/contracts'

export interface ReceiveMalfunctionReportRequest {
  // no input needed — fetches all from service
}

export interface ReceiveMalfunctionReportResponse {
  reports: VehicleConditionReport[]
}
