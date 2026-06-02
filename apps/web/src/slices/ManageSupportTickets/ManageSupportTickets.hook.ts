import { useState } from 'react'
import type { ManageSupportTicketsViewState } from './ManageSupportTickets.types'

export function useManageSupportTickets(): ManageSupportTicketsViewState {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { loading, error }
}
