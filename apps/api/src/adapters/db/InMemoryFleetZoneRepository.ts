import { IFleetZoneRepository, FleetZone } from '@mvp/contracts';

const DEMO_ZONES: FleetZone[] = [
  {
    id: 'z1',
    name: 'Centro Storico',
    center: { lat: 45.4654, lng: 9.1859 },
    radiusKm: 1.5,
  },
  {
    id: 'z2',
    name: 'Navigli',
    center: { lat: 45.455, lng: 9.178 },
    radiusKm: 0.8,
  },
];

export class InMemoryFleetZoneRepository implements IFleetZoneRepository {
  private readonly zones: FleetZone[] = DEMO_ZONES;

  async findAll(): Promise<FleetZone[]> {
    return this.zones;
  }

  async findById(id: string): Promise<FleetZone | null> {
    return this.zones.find((z) => z.id === id) ?? null;
  }
}
