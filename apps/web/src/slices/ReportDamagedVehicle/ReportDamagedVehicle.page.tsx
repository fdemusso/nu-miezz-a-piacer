import { useReportDamagedVehicle } from './ReportDamagedVehicle.hook'

export function ReportDamagedVehiclePage() {
  const { status } = useReportDamagedVehicle()
  return (
    <div>
      <h2>ReportDamagedVehicle</h2>
      <p>{status}</p>
    </div>
  )
}
