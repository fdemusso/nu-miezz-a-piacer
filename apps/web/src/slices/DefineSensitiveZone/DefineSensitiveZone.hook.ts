import { useState } from 'react'
import type { DefineSensitiveZoneViewState } from './DefineSensitiveZone.types'

export function useDefineSensitiveZone(): DefineSensitiveZoneViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
