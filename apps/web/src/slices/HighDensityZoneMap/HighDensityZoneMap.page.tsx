import { useHighDensityZoneMap } from './HighDensityZoneMap.hook'

export function HighDensityZoneMapPage() {
  const { status } = useHighDensityZoneMap()
  return (
    <div>
      <h2>HighDensityZoneMap</h2>
      <p>{status}</p>
    </div>
  )
}
