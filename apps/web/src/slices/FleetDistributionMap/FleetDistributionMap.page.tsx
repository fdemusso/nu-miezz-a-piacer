import { useFleetDistributionMap } from './FleetDistributionMap.hook'

export function FleetDistributionMapPage() {
  const { loading, error } = useFleetDistributionMap()

  return (
    <div>
      <h1>FleetDistributionMap</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
