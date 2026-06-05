import { useDefineSensitiveZone } from './DefineSensitiveZone.hook'

export function DefineSensitiveZonePage() {
  const { status } = useDefineSensitiveZone()
  return (
    <div>
      <h2>DefineSensitiveZone</h2>
      <p>{status}</p>
    </div>
  )
}
