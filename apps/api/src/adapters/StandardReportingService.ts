import type {
  TimeRange, MobilityReport, FleetZone, IReportingService,
  IFleetZoneRepository, IRideRepository, Ride,
} from '@vsa/contracts'

export class StandardReportingService implements IReportingService {
  constructor(
    private readonly rides?: IRideRepository,
    private readonly fleetZones?: IFleetZoneRepository,
  ) {}

  private async allRides(): Promise<Ride[]> {
    return this.rides ? this.rides.findAll() : []
  }

  async getUsageFrequency(range: TimeRange): Promise<Record<string, number>> {
    const rides = await this.allRides()
    const buckets: Record<string, number> = {}
    for (const r of rides) {
      if (r.startedAt < range.from || r.startedAt > range.to) continue
      const day = r.startedAt.toISOString().slice(0, 10)
      buckets[day] = (buckets[day] ?? 0) + 1
    }
    return buckets
  }

  async getMobilityReport(range: TimeRange): Promise<MobilityReport> {
    const rides = (await this.allRides()).filter(
      r => r.startedAt >= range.from && r.startedAt <= range.to,
    )
    const users = new Set(rides.map(r => r.userId))
    return {
      period: range,
      totalRides: rides.length,
      totalDistance: 0,
      activeUsers: users.size,
    }
  }

  async getHighDensityZones(): Promise<FleetZone[]> {
    const zones = (await this.fleetZones?.findAll()) ?? []
    return [...zones].sort((a, b) => b.vehicleCount - a.vehicleCount).slice(0, 5)
  }
}
