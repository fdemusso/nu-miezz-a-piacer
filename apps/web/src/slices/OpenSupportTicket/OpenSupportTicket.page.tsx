import { useOpenSupportTicket } from './OpenSupportTicket.hook'

export function OpenSupportTicketPage() {
  const { status } = useOpenSupportTicket()
  return (
    <div>
      <h2>OpenSupportTicket</h2>
      <p>{status}</p>
    </div>
  )
}
