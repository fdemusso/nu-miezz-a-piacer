import { useState } from 'react'
import type { MarkUrbanWarningZoneViewState } from './MarkUrbanWarningZone.types'

export function useMarkUrbanWarningZone(): MarkUrbanWarningZoneViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
