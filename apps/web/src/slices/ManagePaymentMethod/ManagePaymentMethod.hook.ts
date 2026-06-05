import { useState } from 'react'
import type { ManagePaymentMethodViewState } from './ManagePaymentMethod.types'

export function useManagePaymentMethod(): ManagePaymentMethodViewState {
  const [status] = useState<ManagePaymentMethodViewState['status']>('idle')
  return { status }
}
