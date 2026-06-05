import { useState } from 'react'
import type { UnlockMethodViewState } from './UnlockMethod.types'

export function useUnlockMethod(): UnlockMethodViewState {
  const [status] = useState<UnlockMethodViewState['status']>('idle')
  return { status }
}
