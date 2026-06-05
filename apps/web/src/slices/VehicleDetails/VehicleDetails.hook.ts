'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Vehicle } from '@mvp/contracts';
import { UseVehicleDetailsResult } from './VehicleDetails.types';

export function useVehicleDetails(vehicleId: string): UseVehicleDetailsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => apiFetch<{ vehicle: Vehicle }>(`/api/vehicles/${vehicleId}`),
    enabled: Boolean(vehicleId),
  });

  return {
    vehicle: data?.vehicle ?? null,
    isLoading,
    error: error as Error | null,
  };
}
