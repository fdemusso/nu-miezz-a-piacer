'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Booking } from '@mvp/contracts';
import { useAppStore } from '@/stores/app.store';
import { UseBookVehicleResult } from './BookVehicle.types';

export function useBookVehicle(): UseBookVehicleResult {
  const setActiveBooking = useAppStore((s) => s.setActiveBooking);
  const queryClient = useQueryClient();

  const { mutateAsync, data, isPending, error } = useMutation({
    mutationFn: ({ vehicleId, userId }: { vehicleId: string; userId: string }) =>
      apiFetch<{ booking: Booking }>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ vehicleId, userId }),
      }),
    onSuccess: ({ booking }) => {
      setActiveBooking(booking);
      queryClient.invalidateQueries({ queryKey: ['nearby-vehicles'] });
    },
  });

  return {
    book: (vehicleId, userId) => mutateAsync({ vehicleId, userId }).then(() => undefined),
    booking: data?.booking ?? null,
    isPending,
    error: error as Error | null,
  };
}
