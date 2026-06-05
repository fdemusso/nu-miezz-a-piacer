import { IRideRepository, IVehicleRepository } from '@mvp/contracts';

export interface PauseRideDeps {
  rideRepo: IRideRepository;
  vehicleRepo: IVehicleRepository;
}
