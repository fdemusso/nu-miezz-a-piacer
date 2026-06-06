'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Clock, MapPin, Bike } from 'lucide-react';
import { RideStatus } from '@mvp/contracts';
import type { Ride } from '@mvp/contracts';
import { useHistory } from './History.hook';

function statusLabel(status: RideStatus): string {
  const labels: Record<RideStatus, string> = {
    [RideStatus.ACTIVE]: 'In corso',
    [RideStatus.PAUSED]: 'In pausa',
    [RideStatus.ENDED]: 'Conclusa',
  };
  return labels[status] ?? status;
}

function statusVariant(status: RideStatus): 'default' | 'secondary' | 'outline' {
  if (status === RideStatus.ENDED) return 'secondary';
  if (status === RideStatus.ACTIVE) return 'default';
  return 'outline';
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCost(cost: Ride['totalCost']): string {
  if (!cost) return '—';
  return `${cost.currency} ${cost.amount.toFixed(2)}`;
}

function formatDuration(minutes: number | undefined): string {
  if (minutes == null) return '—';
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}

function RideCard({ ride }: { ride: Ride }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Bike className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm font-medium truncate">{ride.vehicleId}</span>
          </div>
          <Badge variant={statusVariant(ride.status)} className="shrink-0 text-xs">
            {statusLabel(ride.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{formatDate(ride.startedAt)}</span>
          </div>
          <div className="text-right font-medium">{formatCost(ride.totalCost)}</div>

          {ride.durationMinutes != null && (
            <div className="text-muted-foreground text-xs">
              Durata: {formatDuration(ride.durationMinutes)}
            </div>
          )}
          {ride.distanceKm != null && (
            <div className="text-right text-xs text-muted-foreground">
              {ride.distanceKm.toFixed(1)} km
            </div>
          )}
        </div>

        {ride.endLocation && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>
              {ride.endLocation.lat.toFixed(4)}, {ride.endLocation.lng.toFixed(4)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function HistoryPage() {
  const { rides, isLoading, error } = useHistory();

  return (
    <AppLayout title="Storico">
      <div className="p-4 space-y-3">
        {isLoading && <HistorySkeleton />}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Impossibile caricare lo storico. Riprova.
            </p>
          </div>
        )}

        {!isLoading && !error && rides.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">Nessuna corsa ancora</p>
            <p className="text-xs text-muted-foreground/70">
              Le tue corse appariranno qui dopo la prima corsa.
            </p>
          </div>
        )}

        {!isLoading && !error && rides.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground px-1">
              {rides.length} {rides.length === 1 ? 'corsa' : 'corse'}
            </p>
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </>
        )}
      </div>
    </AppLayout>
  );
}
