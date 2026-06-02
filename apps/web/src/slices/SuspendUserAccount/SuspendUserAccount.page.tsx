import { useSuspendUserAccount } from './SuspendUserAccount.hook'

export function SuspendUserAccountPage() {
  const { loading, error } = useSuspendUserAccount()

  return (
    <div>
      <h1>SuspendUserAccount</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}
