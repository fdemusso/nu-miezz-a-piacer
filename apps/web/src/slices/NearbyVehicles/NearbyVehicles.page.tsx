'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Zap, Bike, Car, AlertCircle, Navigation, Clock, Play, PauseCircle } from 'lucide-react';
import { VehicleType, VehicleStatus, BookingStatus, RideStatus } from '@mvp/contracts';
import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/stores/app.store';
import { useNearbyVehicles } from './NearbyVehicles.hook';
import { useRestoreSession } from '@/hooks/useRestoreSession';
import type { NearbyVehiclesItem } from './NearbyVehicles.types';

const NON_CANCELLABLE_STATUSES = new Set([
  BookingStatus.CONVERTED_TO_RIDE,
  BookingStatus.CANCELLED,
  BookingStatus.EXPIRED,
]);

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

function ActiveSessionBanner() {
  const activeRide = useAppStore((s) => s.activeRide);
  const activeBooking = useAppStore((s) => s.activeBooking);
  const selectedVehicle = useAppStore((s) => s.selectedVehicle);
  const clearSession = useAppStore((s) => s.clearSession);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(false);

  const handleCancel = async () => {
    if (!activeBooking) return;
    if (!window.confirm('Annullare la prenotazione?')) return;
    setCancelling(true);
    setCancelError(false);
    try {
      await apiFetch(`/api/bookings/${activeBooking.id}`, { method: 'DELETE' });
      clearSession();
    } catch {
      setCancelError(true);
    } finally {
      setCancelling(false);
    }
  };

  if (activeRide?.status === RideStatus.PAUSED) {
    const label = selectedVehicle ? `${selectedVehicle.model}` : 'Veicolo';
    return (
      <Link href="/rides/active">
        <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <PauseCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Corsa in pausa</p>
              <p className="text-xs text-amber-700">{label} · in attesa di ripresa</p>
            </div>
          </div>
          <Button size="sm" className="shrink-0 bg-amber-600 hover:bg-amber-700">
            Riprendi
          </Button>
        </div>
      </Link>
    );
  }

  if (activeRide?.status === RideStatus.ACTIVE) {
    const startedAt = new Date(activeRide.startedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const label = selectedVehicle ? `${selectedVehicle.model}` : 'Veicolo';
    return (
      <Link href="/rides/end">
        <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Play className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">Corsa in corso</p>
              <p className="text-xs text-green-700">{label} · iniziata alle {startedAt}</p>
            </div>
          </div>
          <Button size="sm" className="shrink-0 bg-green-700 hover:bg-green-800">
            Termina
          </Button>
        </div>
      </Link>
    );
  }

  if (activeBooking) {
    const expiresAt = new Date(activeBooking.expiresAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const label = selectedVehicle ? `${selectedVehicle.model}` : 'Veicolo';
    const isCancellable = !NON_CANCELLABLE_STATUSES.has(activeBooking.status);
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Prenotazione attiva</p>
              <p className="text-xs text-blue-700">{label} · scade alle {expiresAt}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {isCancellable && (
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? '…' : 'Annulla'}
              </Button>
            )}
            <Button asChild size="sm" className="bg-blue-700 hover:bg-blue-800">
              <Link href={`/vehicles/${activeBooking.vehicleId}/unlock?bookingId=${activeBooking.id}`}>Sblocca</Link>
            </Button>
          </div>
        </div>
        {cancelError && (
          <p className="text-xs text-destructive px-1">Errore durante la cancellazione. Riprova.</p>
        )}
      </div>
    );
  }

  return null;
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
              <Link href={`/vehicles/${item.id}`}>Vedi dettagli</Link>
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
  useRestoreSession();
  const { vehicles, isLoading, error, usingFallback } = useNearbyVehicles();

  return (
    <AppLayout title="Vicino a te">
      <div className="p-4 space-y-4">
        <ActiveSessionBanner />

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
