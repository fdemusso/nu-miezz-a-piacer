'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ProfileResponse } from './Profile.types';

const DEMO_USER_ID = 'u1';

export function useProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', DEMO_USER_ID],
    queryFn: () => apiFetch<ProfileResponse>(`/api/profile?userId=${DEMO_USER_ID}`),
  });

  return {
    profile: data?.profile ?? null,
    isLoading,
    error: error as Error | null,
  };
}
