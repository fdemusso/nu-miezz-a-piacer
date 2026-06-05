'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Zap, Bike, Car, AlertCircle, Navigation } from 'lucide-react';
import { VehicleType, VehicleStatus } from '@mvp/contracts';
import { useNearbyVehicles } from './NearbyVehicles.hook';
import type { NearbyVehiclesItem } from './NearbyVehicles.types';

function vehicleIcon(type: VehicleType) {
  if (type === VehicleType.BIKE) return <Bike className="h-5 w-5" />;
  if (type === VehicleType.CAR) return <Car className="h-5 w-5" />;
  return <Zap className="h-5 w-5" />;
}

function vehicleTypeLabel(type: VehicleType) {
  const labels: Record<VehicleType, string> = {
    [VehicleType.SCOOTER]: 'Scooter',
    [VehicleType.BIKE]: 'Bici',
    [VehicleType.MOPED]: 'Moped',
    [VehicleType.CAR]: 'Auto',
  };
  return labels[type];
}

function statusBadge(status: VehicleStatus) {
  const config: Record<VehicleStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    [VehicleStatus.AVAILABLE]: { label: 'Disponibile', variant: 'default' },
    [VehicleStatus.IN_USE]: { label: 'In uso', variant: 'secondary' },
    [VehicleStatus.RESERVED]: { label: 'Riservato', variant: 'outline' },
    [VehicleStatus.MAINTENANCE]: { label: 'Manutenzione', variant: 'destructive' },
    [VehicleStatus.OFFLINE]: { label: 'Offline', variant: 'secondary' },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function batteryColor(level: number) {
  if (level > 50) return 'text-green-600';
  if (level > 20) return 'text-yellow-600';
  return 'text-red-600';
}

function formatDistance(meters: number) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function VehicleCard({ item }: { item: NearbyVehiclesItem }) {
  const isAvailable = item.status === VehicleStatus.AVAILABLE;
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {vehicleIcon(item.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm truncate">{vehicleTypeLabel(item.type)}</span>
                <span className="text-xs text-muted-foreground font-mono">{item.plateOrCode}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formatDistance(item.distanceMeters)} · ~{item.estimatedWalkMinutes} min a piedi
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {statusBadge(item.status)}
            <span className={`text-xs font-medium ${batteryColor(item.batteryLevel)}`}>
              {item.batteryLevel}%
            </span>
          </div>
        </div>
        {isAvailable && (
          <div className="mt-3">
            <Button asChild size="sm" className="w-full">
              <a href={`/vehicles/${item.id}`}>Vedi dettagli</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function NearbyVehiclesPage() {
  const { vehicles, isLoading, error, usingFallback } = useNearbyVehicles();

  return (
    <AppLayout title="Vicino a te" activeNav="/">
      <div className="p-4 space-y-4">
        {usingFallback && (
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            <Navigation className="h-3.5 w-3.5 shrink-0" />
            Posizione demo — Milano Duomo
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Impossibile caricare i veicoli. Riprova.
            </p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Riprova
            </Button>
          </div>
        )}

        {!isLoading && !error && vehicles.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nessun veicolo trovato nelle vicinanze.
            </p>
          </div>
        )}

        {!isLoading && !error && vehicles.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {vehicles.length} veicol{vehicles.length === 1 ? 'o' : 'i'} nelle vicinanze
            </p>
            {vehicles.map((v) => (
              <VehicleCard key={v.id} item={v} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
