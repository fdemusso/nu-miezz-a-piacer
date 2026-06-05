'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Coordinates } from '@mvp/contracts';
import { UseNearbyVehiclesResult, NearbyVehiclesResponse } from './NearbyVehicles.types';

const FALLBACK_COORDS: Coordinates = { lat: 45.4654, lng: 9.1859 };
const DEFAULT_RADIUS_KM = 2;

function useGeolocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setCoords(FALLBACK_COORDS);
      setUsingFallback(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setCoords(FALLBACK_COORDS);
        setUsingFallback(true);
      },
      { timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  return { coords, usingFallback };
}

export function useNearbyVehicles(radiusKm = DEFAULT_RADIUS_KM): UseNearbyVehiclesResult {
  const { coords, usingFallback } = useGeolocation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['nearby-vehicles', coords?.lat, coords?.lng, radiusKm],
    queryFn: () =>
      apiFetch<NearbyVehiclesResponse>(
        `/api/vehicles/nearby?lat=${coords!.lat}&lng=${coords!.lng}&radiusKm=${radiusKm}`
      ),
    enabled: coords !== null,
  });

  return {
    vehicles: data?.vehicles ?? [],
    isLoading: isLoading || coords === null,
    error: error as Error | null,
    usingFallback,
    userPosition: coords,
    refetch,
  };
}
