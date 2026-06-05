import { useReceiveMalfunctionReport } from './ReceiveMalfunctionReport.hook'

export function ReceiveMalfunctionReportPage() {
  const { status } = useReceiveMalfunctionReport()
  return (
    <div>
      <h2>ReceiveMalfunctionReport</h2>
      <p>{status}</p>
    </div>
  )
}
