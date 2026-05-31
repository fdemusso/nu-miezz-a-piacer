import type { IReportingService } from '@vsa/contracts'
import type { HighDensityZoneMapRequest, HighDensityZoneMapResponse } from './HighDensityZoneMap.types'

export function makeHighDensityZoneMapHandler(deps: {
  reportingService: IReportingService
}) {
  return async function highDensityZoneMapHandler(
    req: HighDensityZoneMapRequest
  ): Promise<HighDensityZoneMapResponse> {
    return {} as HighDensityZoneMapResponse
  }
}
