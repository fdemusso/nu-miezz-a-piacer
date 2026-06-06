'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { HistoryResponse } from './History.types';

const DEMO_USER_ID = 'u1';

export function useHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['history', DEMO_USER_ID],
    queryFn: () => apiFetch<HistoryResponse>(`/api/history?userId=${DEMO_USER_ID}`),
  });

  return {
    rides: data?.rides ?? [],
    isLoading,
    error: error as Error | null,
  };
}
