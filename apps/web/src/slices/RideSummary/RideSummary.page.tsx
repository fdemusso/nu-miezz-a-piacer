import { useRideSummary } from './RideSummary.hook'

export function RideSummaryPage() {
  const { loading, error } = useRideSummary()

  return (
    <div>
      <h1>RideSummary</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
