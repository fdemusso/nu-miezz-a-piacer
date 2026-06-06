'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/stores/app.store';
import type { Ride, Booking, Vehicle } from '@mvp/contracts';

interface SessionSnapshot {
  ride: Ride | null;
  booking: Booking | null;
  vehicle: Vehicle | null;
}

const DEMO_USER_ID = 'u1';

export function useRestoreSession() {
  const restored = useRef(false);
  const setActiveRide = useAppStore((s) => s.setActiveRide);
  const setActiveBooking = useAppStore((s) => s.setActiveBooking);
  const setSelectedVehicle = useAppStore((s) => s.setSelectedVehicle);

  const { data } = useQuery<SessionSnapshot>({
    queryKey: ['session', DEMO_USER_ID],
    queryFn: () => apiFetch<SessionSnapshot>(`/api/session?userId=${DEMO_USER_ID}`),
    staleTime: 0,
  });

  useEffect(() => {
    if (!data || restored.current) return;
    restored.current = true;
    setActiveRide(data.ride);
    setActiveBooking(data.booking);
    setSelectedVehicle(data.vehicle);
  }, [data, setActiveRide, setActiveBooking, setSelectedVehicle]);
}
