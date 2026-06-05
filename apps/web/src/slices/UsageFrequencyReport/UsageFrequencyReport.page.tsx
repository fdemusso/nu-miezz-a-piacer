import { useUsageFrequencyReport } from './UsageFrequencyReport.hook'

export function UsageFrequencyReportPage() {
  const { status } = useUsageFrequencyReport()
  return (
    <div>
      <h2>UsageFrequencyReport</h2>
      <p>{status}</p>
    </div>
  )
}
