export interface UsageFrequencyReportRequest {
  from: string
  to: string
}

export interface UsageFrequencyReportResponse {
  from: string
  to: string
  data: Record<string, number>
}
