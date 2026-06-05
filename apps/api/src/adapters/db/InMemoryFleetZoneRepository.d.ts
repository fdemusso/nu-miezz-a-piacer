import { IFleetZoneRepository, FleetZone } from '@mvp/contracts';
export declare class InMemoryFleetZoneRepository implements IFleetZoneRepository {
    private readonly zones;
    findAll(): Promise<FleetZone[]>;
    findById(id: string): Promise<FleetZone | null>;
}
