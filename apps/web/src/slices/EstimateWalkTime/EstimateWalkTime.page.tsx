import { useEstimateWalkTime } from './EstimateWalkTime.hook'

export function EstimateWalkTimePage() {
  const { loading, error } = useEstimateWalkTime()

  return (
    <div>
      <h1>EstimateWalkTime</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
