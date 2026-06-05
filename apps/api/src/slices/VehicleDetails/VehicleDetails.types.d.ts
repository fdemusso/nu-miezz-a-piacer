import { Vehicle } from '@mvp/contracts';
export interface VehicleDetailsParams {
    vehicleId: string;
}
export interface VehicleDetailsResponse {
    vehicle: Vehicle;
}
export interface VehicleDetailsDeps {
    vehicleRepo: import('@mvp/contracts').IVehicleRepository;
}
