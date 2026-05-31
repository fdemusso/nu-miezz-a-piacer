import React from 'react'
import { useOpenSupportTicket } from './OpenSupportTicket.hook'

export function OpenSupportTicketPage() {
  const { loading, error } = useOpenSupportTicket()

  return (
    <div>
      <h1>OpenSupportTicket</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
