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
      (pos) => {
        const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // Demo vehicles are seeded in Milan — use fallback if user is too far
        const distKm = Math.sqrt(
          Math.pow((userCoords.lat - FALLBACK_COORDS.lat) * 111, 2) +
          Math.pow((userCoords.lng - FALLBACK_COORDS.lng) * 80, 2)
        );
        if (distKm > 50) {
          setCoords(FALLBACK_COORDS);
          setUsingFallback(true);
        } else {
          setCoords(userCoords);
        }
      },
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
    refetchOnMount: 'always',
    staleTime: 0,
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
