import type { MobilityReport } from '@vsa/contracts'

export interface MobilityPeriodicReportRequest {
  from: string
  to: string
}

export interface MobilityPeriodicReportResponse {
  report: MobilityReport
}
