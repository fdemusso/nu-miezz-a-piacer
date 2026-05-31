import { useState } from 'react'
import type { UnlockMethodViewState } from './UnlockMethod.types'

export function useUnlockMethod(): UnlockMethodViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
