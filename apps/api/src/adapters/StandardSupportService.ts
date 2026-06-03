import type { SupportTicket, ISupportService } from '@vsa/contracts'

export class StandardSupportService implements ISupportService {
  private byId = new Map<string, SupportTicket>()
  private seq = 0

  async openTicket(userId: string, subject: string, body: string): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: `tkt_${++this.seq}`,
      userId,
      subject,
      body,
      status: 'open',
      createdAt: new Date(),
    }
    this.byId.set(ticket.id, ticket)
    return ticket
  }

  async listTickets(): Promise<SupportTicket[]> {
    return [...this.byId.values()]
  }

  async getTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return [...this.byId.values()].filter(t => t.userId === userId)
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<SupportTicket> {
    const ticket = this.byId.get(ticketId)
    if (!ticket) throw Object.assign(new Error('Ticket not found'), { status: 404 })
    const updated = { ...ticket, status }
    this.byId.set(ticketId, updated)
    return updated
  }
}
