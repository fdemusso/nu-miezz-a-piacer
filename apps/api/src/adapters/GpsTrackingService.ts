import type {
  Coordinates, TimeRange, VehiclePositionSnapshot, IGpsTrackingService,
} from '@vsa/contracts'

export class GpsTrackingService implements IGpsTrackingService {
  private latest = new Map<string, Coordinates>()
  private history = new Map<string, VehiclePositionSnapshot[]>()

  recordForTest(snapshot: VehiclePositionSnapshot): void {
    this.latest.set(snapshot.vehicleId, snapshot.position)
    const list = this.history.get(snapshot.vehicleId) ?? []
    list.push(snapshot)
    this.history.set(snapshot.vehicleId, list)
  }

  async getPosition(vehicleId: string): Promise<Coordinates> {
    const p = this.latest.get(vehicleId)
    if (!p) throw new Error(`no position for vehicle ${vehicleId}`)
    return p
  }

  async getHistory(vehicleId: string, range: TimeRange): Promise<VehiclePositionSnapshot[]> {
    const list = this.history.get(vehicleId) ?? []
    return list.filter(s => s.recordedAt >= range.from && s.recordedAt <= range.to)
  }
}
