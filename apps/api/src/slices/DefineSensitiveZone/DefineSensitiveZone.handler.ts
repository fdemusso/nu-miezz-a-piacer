import type { IZoneRepository, IZoneValidator } from '@vsa/contracts'
import type { DefineSensitiveZoneRequest, DefineSensitiveZoneResponse } from './DefineSensitiveZone.types'

export function makeDefineSensitiveZoneHandler(deps: {
  zoneRepo: IZoneRepository
  zoneValidator: IZoneValidator
}) {
  return async function defineSensitiveZoneHandler(
    req: DefineSensitiveZoneRequest
  ): Promise<DefineSensitiveZoneResponse> {
    if (req.boundary.length < 3) {
      throw Object.assign(new Error('boundary must have at least 3 points'), { status: 400 })
    }

    const zone = {
      id: crypto.randomUUID(),
      type: 'sensitive' as const,
      name: req.name,
      boundary: req.boundary,
    }

    await deps.zoneRepo.save(zone)

    return { zone }
  }
}
