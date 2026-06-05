import { useState } from 'react'
import type { SuspendUserAccountViewState } from './SuspendUserAccount.types'

export function useSuspendUserAccount(): SuspendUserAccountViewState {
  const [status] = useState<SuspendUserAccountViewState['status']>('idle')
  return { status }
}
