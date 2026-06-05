import { useMarkUrbanWarningZone } from './MarkUrbanWarningZone.hook'

export function MarkUrbanWarningZonePage() {
  const { status } = useMarkUrbanWarningZone()
  return (
    <div>
      <h2>MarkUrbanWarningZone</h2>
      <p>{status}</p>
    </div>
  )
}
