'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Ride, Money } from '@mvp/contracts';
import { useAppStore } from '@/stores/app.store';
import { UseEndRideResult } from './EndRide.types';

export function useEndRide(): UseEndRideResult {
  const clearSession = useAppStore((s) => s.clearSession);

  const { mutateAsync, data, isPending, error } = useMutation({
    mutationFn: ({
      rideId,
      userId,
      coords,
      distanceKm,
    }: {
      rideId: string;
      userId: string;
      coords: { lat: number; lng: number };
      distanceKm: number;
    }) =>
      apiFetch<{ ride: Ride; totalCost: Money }>(`/api/rides/${rideId}/end`, {
        method: 'POST',
        body: JSON.stringify({ userId, endLat: coords.lat, endLng: coords.lng, distanceKm }),
      }),
    onSuccess: () => clearSession(),
  });

  return {
    endRide: (rideId, userId, coords, distanceKm) =>
      mutateAsync({ rideId, userId, coords, distanceKm }).then(() => undefined),
    endedRide: data?.ride ?? null,
    totalCost: data?.totalCost ?? null,
    isPending,
    error: error as Error | null,
  };
}
