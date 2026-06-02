import { useUsageFrequencyReport } from './UsageFrequencyReport.hook'

export function UsageFrequencyReportPage() {
  const { loading, error } = useUsageFrequencyReport()

  return (
    <div>
      <h1>UsageFrequencyReport</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
