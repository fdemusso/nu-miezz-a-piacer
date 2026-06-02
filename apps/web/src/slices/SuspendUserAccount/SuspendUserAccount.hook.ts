import { useState } from 'react'
import type { SuspendUserAccountViewState } from './SuspendUserAccount.types'

export function useSuspendUserAccount(): SuspendUserAccountViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
