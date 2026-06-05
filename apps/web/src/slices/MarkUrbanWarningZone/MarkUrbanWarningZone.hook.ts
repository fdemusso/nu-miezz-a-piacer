import { useState } from 'react'
import type { MarkUrbanWarningZoneViewState } from './MarkUrbanWarningZone.types'

export function useMarkUrbanWarningZone(): MarkUrbanWarningZoneViewState {
  const [status] = useState<MarkUrbanWarningZoneViewState['status']>('idle')
  return { status }
}
