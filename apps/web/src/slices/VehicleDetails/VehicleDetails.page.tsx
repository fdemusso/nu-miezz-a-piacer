'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Bike,
  Car,
  Zap,
  Battery,
  Gauge,
  Weight,
  MapPin,
  Wifi,
  Lock,
  Usb,
  HardHat,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';
import { VehicleType, VehicleStatus } from '@mvp/contracts';
import type { Vehicle } from '@mvp/contracts';
import { useVehicleDetails } from './VehicleDetails.hook';

interface VehicleDetailsPageProps {
  vehicleId: string;
}

function vehicleIcon(type: VehicleType) {
  if (type === VehicleType.BIKE) return <Bike className="h-7 w-7" />;
  if (type === VehicleType.CAR) return <Car className="h-7 w-7" />;
  return <Zap className="h-7 w-7" />;
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
  if (level > 20) return 'text-yellow-500';
  return 'text-red-500';
}

function batteryBarColor(level: number) {
  if (level > 50) return 'bg-green-500';
  if (level > 20) return 'bg-yellow-400';
  return 'bg-red-500';
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(amount);
}

function HeroCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {vehicleIcon(vehicle.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold leading-tight">{vehicle.model}</h2>
                <p className="text-sm text-muted-foreground">{vehicleTypeLabel(vehicle.type)}</p>
              </div>
              {statusBadge(vehicle.status)}
            </div>
            {vehicle.licensePlate && (
              <p className="mt-1 text-xs text-muted-foreground font-mono">{vehicle.licensePlate}</p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Battery className="h-4 w-4" />
              Batteria
            </span>
            <span className={`font-semibold ${batteryColor(vehicle.battery.level)}`}>
              {vehicle.battery.level}% · ~{vehicle.battery.estimatedRangeKm} km
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${batteryBarColor(vehicle.battery.level)}`}
              style={{ width: `${vehicle.battery.level}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({ vehicle }: { vehicle: Vehicle }) {
  const { pricing } = vehicle;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tariffe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="flex justify-between text-sm">
          <span>Sblocco</span>
          <span className="font-medium">
            {formatMoney(pricing.unlockFee.amount, pricing.unlockFee.currency)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Al minuto</span>
          <span className="font-medium">
            {formatMoney(pricing.perMinuteRate.amount, pricing.perMinuteRate.currency)}/min
          </span>
        </div>
        {pricing.perKmRate && (
          <div className="flex justify-between text-sm">
            <span>Al km</span>
            <span className="font-medium">
              {formatMoney(pricing.perKmRate.amount, pricing.perKmRate.currency)}/km
            </span>
          </div>
        )}
        {pricing.pauseRate && (
          <div className="flex justify-between text-sm">
            <span>In pausa</span>
            <span className="font-medium">
              {formatMoney(pricing.pauseRate.amount, pricing.pauseRate.currency)}/min
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SpecsCard({ vehicle }: { vehicle: Vehicle }) {
  const { specs } = vehicle;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Specifiche
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 pt-0">
        <div className="flex flex-col items-center gap-1 text-center">
          <Gauge className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-bold">{specs.maxSpeedKmh}</span>
          <span className="text-xs text-muted-foreground">km/h max</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-bold">{specs.maxRangeKm}</span>
          <span className="text-xs text-muted-foreground">km autonomia</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Weight className="h-5 w-5 text-muted-foreground" />
          <span className="text-base font-bold">{specs.weightKg}</span>
          <span className="text-xs text-muted-foreground">kg peso</span>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturesCard({ vehicle }: { vehicle: Vehicle }) {
  const { features } = vehicle;
  const items = [
    { label: 'GPS', icon: Wifi, active: features.hasGps },
    { label: 'Portacasco', icon: HardHat, active: features.hasHelmetStorage },
    { label: 'USB', icon: Usb, active: features.hasUsb },
    { label: 'Blocco', icon: Lock, active: features.hasLock },
  ];
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Dotazioni
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 gap-3">
          {items.map(({ label, icon: Icon, active }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 rounded-lg p-2 text-center ${
                active ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground opacity-40'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

export function VehicleDetailsPage({ vehicleId }: VehicleDetailsPageProps) {
  const { vehicle, isLoading, error } = useVehicleDetails(vehicleId);

  const isAvailable = vehicle?.status === VehicleStatus.AVAILABLE;

  return (
    <AppLayout title="Dettaglio veicolo" hideNav>
      <div className="pb-28">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Impossibile caricare il veicolo. Riprova.
            </p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Riprova
            </Button>
          </div>
        )}

        {!isLoading && !error && !vehicle && (
          <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Veicolo non trovato</p>
            <p className="text-sm text-muted-foreground">
              Questo veicolo non esiste o non è più disponibile.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Torna alla lista
              </a>
            </Button>
          </div>
        )}

        {!isLoading && !error && vehicle && (
          <div className="p-4 space-y-3">
            <HeroCard vehicle={vehicle} />
            <PricingCard vehicle={vehicle} />
            <SpecsCard vehicle={vehicle} />
            <FeaturesCard vehicle={vehicle} />
          </div>
        )}
      </div>

      {/* Sticky bottom CTA */}
      {!isLoading && !error && vehicle && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t p-4">
          <Button
            className="w-full"
            size="lg"
            disabled={!isAvailable}
          >
            {isAvailable ? 'Prenota — prossimo step' : 'Non disponibile'}
          </Button>
          {isAvailable && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              La prenotazione sarà disponibile nel prossimo aggiornamento
            </p>
          )}
        </div>
      )}
    </AppLayout>
  );
}
