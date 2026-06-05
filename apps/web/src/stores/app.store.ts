import { create } from 'zustand';
import { Vehicle, Ride, Booking } from '@mvp/contracts';

interface AppState {
  // Active session state
  selectedVehicle: Vehicle | null;
  activeBooking: Booking | null;
  activeRide: Ride | null;

  // Actions
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setActiveBooking: (booking: Booking | null) => void;
  setActiveRide: (ride: Ride | null) => void;
  clearSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedVehicle: null,
  activeBooking: null,
  activeRide: null,

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setActiveBooking: (booking) => set({ activeBooking: booking }),
  setActiveRide: (ride) => set({ activeRide: ride }),
  clearSession: () => set({ selectedVehicle: null, activeBooking: null, activeRide: null }),
}));
