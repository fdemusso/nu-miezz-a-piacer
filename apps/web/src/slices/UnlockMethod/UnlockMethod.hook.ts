import { useState } from 'react'
import type { UnlockMethodViewState } from './UnlockMethod.types'

export function useUnlockMethod(): UnlockMethodViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
