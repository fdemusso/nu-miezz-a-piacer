import type { IReportingService } from '@vsa/contracts'
import type { MobilityPeriodicReportRequest, MobilityPeriodicReportResponse } from './MobilityPeriodicReport.types'

export function makeMobilityPeriodicReportHandler(deps: {
  reportingService: IReportingService
}) {
  return async function mobilityPeriodicReportHandler(
    req: MobilityPeriodicReportRequest
  ): Promise<MobilityPeriodicReportResponse> {
    const from = new Date(req.from)
    const to = new Date(req.to)

    const report = await deps.reportingService.getMobilityReport({ from, to })

    return { report }
  }
}
