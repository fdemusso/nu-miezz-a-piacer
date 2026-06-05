import { IRideRepository, IBookingRepository, IVehicleRepository } from '@mvp/contracts';
export interface RestoreSessionDeps {
    rideRepo: IRideRepository;
    bookingRepo: IBookingRepository;
    vehicleRepo: IVehicleRepository;
}
