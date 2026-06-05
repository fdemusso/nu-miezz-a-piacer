import { useFleetDistributionMap } from './FleetDistributionMap.hook'

export function FleetDistributionMapPage() {
  const { status } = useFleetDistributionMap()
  return (
    <div>
      <h2>FleetDistributionMap</h2>
      <p>{status}</p>
    </div>
  )
}
