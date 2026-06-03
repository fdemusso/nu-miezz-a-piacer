import type { IReportingService } from '@vsa/contracts'
import type { HighDensityZoneMapRequest, HighDensityZoneMapResponse } from './HighDensityZoneMap.types'

export function makeHighDensityZoneMapHandler(deps: {
  reportingService: IReportingService
}) {
  return async function highDensityZoneMapHandler(
    _req: HighDensityZoneMapRequest
  ): Promise<HighDensityZoneMapResponse> {
    const zones = await deps.reportingService.getHighDensityZones()
    return { zones }
  }
}
