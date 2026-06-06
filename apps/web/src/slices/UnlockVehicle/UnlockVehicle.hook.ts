'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Ride } from '@mvp/contracts';
import { useAppStore } from '@/stores/app.store';
import { UseUnlockVehicleResult } from './UnlockVehicle.types';

export function useUnlockVehicle(): UseUnlockVehicleResult {
  const setActiveRide = useAppStore((s) => s.setActiveRide);
  const queryClient = useQueryClient();

  const { mutateAsync, data, isPending, error } = useMutation({
    mutationFn: ({
      bookingId,
      userId,
      coords,
    }: {
      bookingId: string;
      userId: string;
      coords: { lat: number; lng: number };
    }) =>
      apiFetch<{ ride: Ride }>('/api/rides/unlock', {
        method: 'POST',
        body: JSON.stringify({ bookingId, userId, startLat: coords.lat, startLng: coords.lng }),
      }),
    onSuccess: ({ ride }) => {
      setActiveRide(ride);
      queryClient.invalidateQueries({ queryKey: ['nearby-vehicles'] });
    },
  });

  return {
    unlock: (bookingId, userId, coords) =>
      mutateAsync({ bookingId, userId, coords }).then(() => undefined),
    ride: data?.ride ?? null,
    isPending,
    error: error as Error | null,
  };
}
