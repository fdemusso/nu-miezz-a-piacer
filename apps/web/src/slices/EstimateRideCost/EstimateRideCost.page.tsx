import { useEstimateRideCost } from './EstimateRideCost.hook'

export function EstimateRideCostPage() {
  const { status } = useEstimateRideCost()
  return (
    <div>
      <h2>EstimateRideCost</h2>
      <p>{status}</p>
    </div>
  )
}
