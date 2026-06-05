import { Booking } from '@mvp/contracts';
export interface BookVehicleBody {
    userId: string;
    vehicleId: string;
}
export interface BookVehicleResponse {
    booking: Booking;
}
export interface BookVehicleDeps {
    bookingRepo: import('@mvp/contracts').IBookingRepository;
    vehicleRepo: import('@mvp/contracts').IVehicleRepository;
}
