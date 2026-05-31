import { useState } from 'react'
import type { SuspendUserAccountViewState } from './SuspendUserAccount.types'

export function useSuspendUserAccount(): SuspendUserAccountViewState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { loading, error }
}
