import { useState } from 'react'
import type { DefineSensitiveZoneViewState } from './DefineSensitiveZone.types'

export function useDefineSensitiveZone(): DefineSensitiveZoneViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
