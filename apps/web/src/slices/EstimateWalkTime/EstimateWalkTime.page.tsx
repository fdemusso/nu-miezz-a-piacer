import { useEstimateWalkTime } from './EstimateWalkTime.hook'

export function EstimateWalkTimePage() {
  const { status } = useEstimateWalkTime()
  return (
    <div>
      <h2>EstimateWalkTime</h2>
      <p>{status}</p>
    </div>
  )
}
