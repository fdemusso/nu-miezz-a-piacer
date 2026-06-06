'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { SearchFiltersState, SearchVehiclesResponse, UseSearchResult } from './Search.types';

function buildQueryString(filters: SearchFiltersState): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('query', filters.query.trim());
  if (filters.type) params.set('type', filters.type);
  if (filters.onlyAvailable) params.set('onlyAvailable', 'true');
  return params.toString();
}

export function useSearch(filters: SearchFiltersState, enabled: boolean): UseSearchResult {
  const qs = buildQueryString(filters);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search-vehicles', qs],
    queryFn: () => apiFetch<SearchVehiclesResponse>(`/api/vehicles/search?${qs}`),
    enabled,
  });

  return {
    results: data ?? null,
    isLoading,
    error: error as Error | null,
  };
}
