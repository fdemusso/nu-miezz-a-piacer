import type { IReportingService } from '@vsa/contracts'
import type { UsageFrequencyReportRequest, UsageFrequencyReportResponse } from './UsageFrequencyReport.types'

export function makeUsageFrequencyReportHandler(deps: {
  reportingService: IReportingService
}) {
  return async function usageFrequencyReportHandler(
    req: UsageFrequencyReportRequest
  ): Promise<UsageFrequencyReportResponse> {
    const from = new Date(req.from)
    const to = new Date(req.to)

    const data = await deps.reportingService.getUsageFrequency({ from, to })

    return { from: req.from, to: req.to, data }
  }
}
