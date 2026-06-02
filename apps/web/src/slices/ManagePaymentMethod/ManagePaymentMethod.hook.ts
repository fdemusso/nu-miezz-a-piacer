import { useState } from 'react'
import type { ManagePaymentMethodViewState } from './ManagePaymentMethod.types'

export function useManagePaymentMethod(): ManagePaymentMethodViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
