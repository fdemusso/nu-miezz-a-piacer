import { useRideSummary } from './RideSummary.hook'

export function RideSummaryPage() {
  const { status } = useRideSummary()
  return (
    <div>
      <h2>RideSummary</h2>
      <p>{status}</p>
    </div>
  )
}
