'use client';

import { useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, AlertCircle, Bike, Zap, X } from 'lucide-react';
import { VehicleType, VehicleStatus } from '@mvp/contracts';
import type { SearchVehicleItem } from '@mvp/contracts';
import { cn } from '@/lib/utils';
import { useSearch } from './Search.hook';
import type { SearchFiltersState } from './Search.types';

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  [VehicleType.SCOOTER]: 'Scooter',
  [VehicleType.BIKE]: 'Bici',
  [VehicleType.MOPED]: 'Moped',
  [VehicleType.CAR]: 'Auto',
};

const STATUS_LABELS: Record<VehicleStatus, string> = {
  [VehicleStatus.AVAILABLE]: 'Disponibile',
  [VehicleStatus.IN_USE]: 'In uso',
  [VehicleStatus.RESERVED]: 'Riservato',
  [VehicleStatus.MAINTENANCE]: 'Manutenzione',
  [VehicleStatus.OFFLINE]: 'Offline',
};

function statusVariant(status: VehicleStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (status === VehicleStatus.AVAILABLE) return 'default';
  if (status === VehicleStatus.IN_USE) return 'secondary';
  return 'outline';
}

function VehicleCard({ vehicle }: { vehicle: SearchVehicleItem }) {
  return (
    <a href={`/vehicles/${vehicle.id}`} className="block">
      <Card className="active:scale-[0.98] transition-transform">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{vehicle.plateOrCode}</p>
              <p className="text-xs text-muted-foreground truncate">{vehicle.model}</p>
            </div>
            <Badge variant={statusVariant(vehicle.status)} className="shrink-0 text-xs">
              {STATUS_LABELS[vehicle.status]}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bike className="h-3.5 w-3.5" />
              <span>{VEHICLE_TYPE_LABELS[vehicle.type]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              <span>{vehicle.batteryLevel}% · {vehicle.estimatedRangeKm} km</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

const EMPTY_FILTERS: SearchFiltersState = {
  query: '',
  type: '',
  onlyAvailable: false,
};

export function SearchPage() {
  const [filters, setFilters] = useState<SearchFiltersState>(EMPTY_FILTERS);
  const [submitted, setSubmitted] = useState(false);

  const hasFilters = filters.query.trim() || filters.type || filters.onlyAvailable;
  const { results, isLoading, error } = useSearch(filters, submitted);

  const handleSearch = useCallback(() => {
    setSubmitted(true);
  }, []);

  const handleReset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSubmitted(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
    },
    [handleSearch]
  );

  return (
    <AppLayout title="Ricerca" activeNav="/search">
      <div className="p-4 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 pr-9"
            placeholder="Modello o targa..."
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            onKeyDown={handleKeyDown}
          />
          {filters.query && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setFilters((f) => ({ ...f, query: '' }))}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-muted-foreground shrink-0">Tipo:</span>
          {(['', ...Object.values(VehicleType)] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilters((f) => ({ ...f, type: t }))}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1 text-xs transition-colors',
                filters.type === t
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:border-foreground'
              )}
            >
              {t === '' ? 'Tutti' : VEHICLE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Only available toggle */}
        <button
          onClick={() => setFilters((f) => ({ ...f, onlyAvailable: !f.onlyAvailable }))}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors',
            filters.onlyAvailable
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground hover:border-foreground'
          )}
        >
          Solo disponibili
        </button>

        {/* CTA */}
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleSearch} disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            Cerca
          </Button>
          {(submitted || hasFilters) && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>

        {/* Results */}
        {isLoading && <SearchSkeleton />}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">Errore nella ricerca. Riprova.</p>
          </div>
        )}

        {!isLoading && !error && submitted && results && results.total === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">Nessun risultato</p>
            <p className="text-xs text-muted-foreground/70">
              Prova con altri filtri o una parola diversa.
            </p>
          </div>
        )}

        {!isLoading && !error && results && results.total > 0 && (
          <>
            <p className="text-xs text-muted-foreground px-1">
              {results.total} {results.total === 1 ? 'veicolo' : 'veicoli'}
            </p>
            <div className="space-y-4">
              {results.vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </>
        )}

        {!submitted && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">Cerca un veicolo</p>
            <p className="text-xs text-muted-foreground/70">
              Filtra per modello, targa, tipo o disponibilità.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
