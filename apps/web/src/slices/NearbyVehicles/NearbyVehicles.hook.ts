'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Vehicle } from '@mvp/contracts';
import { UseNearbyVehiclesResult } from './NearbyVehicles.types';

interface NearbyVehiclesResponse {
  vehicles: Vehicle[];
}

export function useNearbyVehicles(lat: number, lng: number, radiusKm = 2): UseNearbyVehiclesResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['nearby-vehicles', lat, lng, radiusKm],
    queryFn: () =>
      apiFetch<NearbyVehiclesResponse>(
        `/api/vehicles/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
      ),
    enabled: Boolean(lat && lng),
  });

  return {
    vehicles: data?.vehicles ?? [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
