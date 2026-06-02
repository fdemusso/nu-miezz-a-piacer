import { useEstimateRideCost } from './EstimateRideCost.hook'

export function EstimateRideCostPage() {
  const { loading, error } = useEstimateRideCost()

  return (
    <div>
      <h1>EstimateRideCost</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
