import { useConfigureParkingBonus } from './ConfigureParkingBonus.hook'

export function ConfigureParkingBonusPage() {
  const { status } = useConfigureParkingBonus()
  return (
    <div>
      <h2>ConfigureParkingBonus</h2>
      <p>{status}</p>
    </div>
  )
}
