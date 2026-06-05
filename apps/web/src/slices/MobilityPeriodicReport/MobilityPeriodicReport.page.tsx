import { useMobilityPeriodicReport } from './MobilityPeriodicReport.hook'

export function MobilityPeriodicReportPage() {
  const { status } = useMobilityPeriodicReport()
  return (
    <div>
      <h2>MobilityPeriodicReport</h2>
      <p>{status}</p>
    </div>
  )
}
