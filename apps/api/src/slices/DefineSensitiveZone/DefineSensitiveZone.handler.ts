import type { IZoneRepository, IZoneValidator } from '@vsa/contracts'
import type { DefineSensitiveZoneRequest, DefineSensitiveZoneResponse } from './DefineSensitiveZone.types'

export function makeDefineSensitiveZoneHandler(deps: {
  zoneRepo: IZoneRepository
  zoneValidator: IZoneValidator
}) {
  return async function defineSensitiveZoneHandler(
    req: DefineSensitiveZoneRequest
  ): Promise<DefineSensitiveZoneResponse> {
    return {} as DefineSensitiveZoneResponse
  }
}
