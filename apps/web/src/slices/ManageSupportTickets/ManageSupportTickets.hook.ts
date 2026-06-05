import { useState } from 'react'
import type { ManageSupportTicketsViewState } from './ManageSupportTickets.types'

export function useManageSupportTickets(): ManageSupportTicketsViewState {
  const [status] = useState<ManageSupportTicketsViewState['status']>('idle')
  return { status }
}
