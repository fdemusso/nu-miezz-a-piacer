import { useHighDensityZoneMap } from './HighDensityZoneMap.hook'

export function HighDensityZoneMapPage() {
  const { loading, error } = useHighDensityZoneMap()

  return (
    <div>
      <h1>HighDensityZoneMap</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
