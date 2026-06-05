'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, Zap, Bike, Car, ChevronLeft } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { VehicleType, VehicleStatus } from '@mvp/contracts';
import type { Vehicle, Booking } from '@mvp/contracts';
import { useBookVehicle } from './BookVehicle.hook';

const DEMO_USER_ID = 'u1';

interface BookVehiclePageProps {
  vehicleId: string;
}

function vehicleIcon(type: VehicleType) {
  if (type === VehicleType.BIKE) return <Bike className="h-6 w-6" />;
  if (type === VehicleType.CAR) return <Car className="h-6 w-6" />;
  return <Zap className="h-6 w-6" />;
}

function vehicleTypeLabel(type: VehicleType) {
  const labels: Record<VehicleType, string> = {
    [VehicleType.SCOOTER]: 'Scooter',
    [VehicleType.BIKE]: 'Bici elettrica',
    [VehicleType.MOPED]: 'Moped',
    [VehicleType.CAR]: 'Auto',
  };
  return labels[type];
}

function formatExpiry(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function BookingConfirmed({ booking, vehicle, vehicleId }: { booking: Booking; vehicle: Vehicle | null; vehicleId: string }) {
  return (
    <div className="p-4 space-y-4">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Prenotazione confermata</p>
              <p className="text-sm text-green-700 mt-0.5">
                Il veicolo è riservato per te fino alle{' '}
                <span className="font-bold">{formatExpiry(booking.expiresAt)}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {vehicle && (
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {vehicleIcon(vehicle.type)}
            </div>
            <div>
              <p className="font-semibold">{vehicle.model}</p>
              <p className="text-sm text-muted-foreground">{vehicleTypeLabel(vehicle.type)}</p>
            </div>
            <Badge className="ml-auto" variant="outline">Riservato</Badge>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Dettagli prenotazione
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ID prenotazione</span>
            <span className="font-mono text-xs">{booking.id.slice(0, 8)}…</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Scade alle</span>
            <span className="font-semibold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatExpiry(booking.expiresAt)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stato</span>
            <Badge variant="default" className="text-xs">Confermata</Badge>
          </div>
        </CardContent>
      </Card>

      <Link href={`/vehicles/${vehicleId}/unlock?bookingId=${booking.id}`} className="block">
        <Button className="w-full" size="lg">
          Vai allo sblocco →
        </Button>
      </Link>

      <Button className="w-full" variant="outline" size="lg" asChild>
        <a href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Torna alla lista
        </a>
      </Button>
    </div>
  );
}

function VehicleSummary({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {vehicleIcon(vehicle.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{vehicle.model}</p>
          <p className="text-sm text-muted-foreground">{vehicleTypeLabel(vehicle.type)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{vehicle.battery.level}%</p>
          <p className="text-xs text-muted-foreground">batteria</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function BookVehiclePage({ vehicleId }: BookVehiclePageProps) {
  const [confirmed, setConfirmed] = useState(false);

  const { data: vehicleData, isLoading: vehicleLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => apiFetch<{ vehicle: Vehicle }>(`/api/vehicles/${vehicleId}`),
  });
  const vehicle = vehicleData?.vehicle ?? null;

  const { book, booking, isPending, error } = useBookVehicle();

  const isAvailable = vehicle?.status === VehicleStatus.AVAILABLE;

  async function handleBook() {
    await book(vehicleId, DEMO_USER_ID);
    setConfirmed(true);
  }

  if (confirmed && booking) {
    return (
      <AppLayout title="Prenotazione" hideNav>
        <BookingConfirmed booking={booking} vehicle={vehicle} vehicleId={vehicleId} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Conferma prenotazione" hideNav>
      <div className="p-4 space-y-4">
        {vehicleLoading && (
          <>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </>
        )}

        {!vehicleLoading && vehicle && (
          <>
            <VehicleSummary vehicle={vehicle} />

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Riepilogo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sblocco</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: vehicle.pricing.unlockFee.currency,
                    }).format(vehicle.pricing.unlockFee.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Al minuto</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('it-IT', {
                      style: 'currency',
                      currency: vehicle.pricing.perMinuteRate.currency,
                    }).format(vehicle.pricing.perMinuteRate.amount)}
                    /min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prenotazione valida</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    10 minuti
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Prenotazione fallita</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={isPending || !isAvailable || vehicleLoading}
          onClick={handleBook}
        >
          {isPending ? 'Prenotazione in corso…' : 'Conferma prenotazione'}
        </Button>
        {!isAvailable && !vehicleLoading && (
          <p className="text-center text-xs text-muted-foreground">
            Veicolo non disponibile
          </p>
        )}
      </div>
    </AppLayout>
  );
}
