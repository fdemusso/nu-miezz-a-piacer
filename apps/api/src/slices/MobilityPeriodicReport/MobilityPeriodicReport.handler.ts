import type { IReportingService } from '@vsa/contracts'
import type { MobilityPeriodicReportRequest, MobilityPeriodicReportResponse } from './MobilityPeriodicReport.types'

export function makeMobilityPeriodicReportHandler(deps: {
  reportingService: IReportingService
}) {
  return async function mobilityPeriodicReportHandler(
    req: MobilityPeriodicReportRequest
  ): Promise<MobilityPeriodicReportResponse> {
    return {} as MobilityPeriodicReportResponse
  }
}
