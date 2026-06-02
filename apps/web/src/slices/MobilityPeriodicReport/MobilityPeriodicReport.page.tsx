import { useMobilityPeriodicReport } from './MobilityPeriodicReport.hook'

export function MobilityPeriodicReportPage() {
  const { loading, error } = useMobilityPeriodicReport()

  return (
    <div>
      <h1>MobilityPeriodicReport</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
