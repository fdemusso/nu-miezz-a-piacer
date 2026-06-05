import { useState } from 'react'
import type { DefineSensitiveZoneViewState } from './DefineSensitiveZone.types'

export function useDefineSensitiveZone(): DefineSensitiveZoneViewState {
  const [status] = useState<DefineSensitiveZoneViewState['status']>('idle')
  return { status }
}
