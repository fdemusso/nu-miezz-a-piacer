import { useDefineSensitiveZone } from './DefineSensitiveZone.hook'

export function DefineSensitiveZonePage() {
  const { loading, error } = useDefineSensitiveZone()

  return (
    <div>
      <h1>DefineSensitiveZone</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
