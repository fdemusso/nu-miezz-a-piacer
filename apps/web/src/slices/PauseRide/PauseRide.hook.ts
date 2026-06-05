'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Ride } from '@mvp/contracts';
import { useAppStore } from '@/stores/app.store';
import { UsePauseRideResult } from './PauseRide.types';

export function usePauseRide(): UsePauseRideResult {
  const setActiveRide = useAppStore((s) => s.setActiveRide);

  const pauseMutation = useMutation({
    mutationFn: ({ rideId, userId }: { rideId: string; userId: string }) =>
      apiFetch<{ ride: Ride }>(`/api/rides/${rideId}/pause`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
    onSuccess: (data) => setActiveRide(data.ride),
  });

  const resumeMutation = useMutation({
    mutationFn: ({ rideId, userId }: { rideId: string; userId: string }) =>
      apiFetch<{ ride: Ride }>(`/api/rides/${rideId}/resume`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
    onSuccess: (data) => setActiveRide(data.ride),
  });

  return {
    pauseRide: (rideId, userId) => pauseMutation.mutateAsync({ rideId, userId }).then(() => undefined),
    resumeRide: (rideId, userId) => resumeMutation.mutateAsync({ rideId, userId }).then(() => undefined),
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
    error: (pauseMutation.error ?? resumeMutation.error) as Error | null,
  };
}
