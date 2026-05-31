import type { IReportingService } from '@vsa/contracts'
import type { UsageFrequencyReportRequest, UsageFrequencyReportResponse } from './UsageFrequencyReport.types'

export function makeUsageFrequencyReportHandler(deps: {
  reportingService: IReportingService
}) {
  return async function usageFrequencyReportHandler(
    req: UsageFrequencyReportRequest
  ): Promise<UsageFrequencyReportResponse> {
    return {} as UsageFrequencyReportResponse
  }
}
