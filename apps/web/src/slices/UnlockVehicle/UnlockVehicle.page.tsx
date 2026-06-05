'use client';

import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Unlock, Timer, MapPin } from 'lucide-react';
import { useUnlockVehicle } from './UnlockVehicle.hook';

const DEMO_USER_ID = 'u1';
const DEMO_COORDS = { lat: 45.4654, lng: 9.1859 };

interface UnlockVehiclePageProps {
  vehicleId: string;
  bookingId: string;
}

export function UnlockVehiclePage({ vehicleId, bookingId }: UnlockVehiclePageProps) {
  const router = useRouter();
  const { unlock, ride, isPending, error } = useUnlockVehicle();

  async function handleUnlock() {
    await unlock(bookingId, DEMO_USER_ID, DEMO_COORDS);
  }

  if (ride) {
    return (
      <AppLayout title="Corsa avviata" hideNav>
        <div className="p-4 space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Veicolo sbloccato!</p>
                  <p className="text-sm text-green-700 mt-0.5">La corsa è iniziata.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Inizio corsa</span>
                <span className="ml-auto font-medium">
                  {new Date(ride.startedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Posizione partenza</span>
                <span className="ml-auto font-mono text-xs">
                  {ride.startLocation.lat.toFixed(4)}, {ride.startLocation.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Stato</span>
                <Badge className="ml-auto" variant="default">In corso</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">ID corsa</span>
                <span className="ml-auto font-mono text-xs">{ride.id.slice(0, 8)}…</span>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/rides/end')}
          >
            Termina corsa
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push('/')}
          >
            Torna alla home
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Sblocca veicolo" hideNav>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Veicolo</span>
              <span className="ml-auto font-mono text-xs">{vehicleId.slice(0, 8)}…</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Prenotazione</span>
              <span className="ml-auto font-mono text-xs">{bookingId.slice(0, 8)}…</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Metodo sblocco</span>
              <Badge variant="outline" className="ml-auto">QR / Mock</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border bg-muted/30 p-4 text-center space-y-1">
          <Unlock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Sei vicino al veicolo?</p>
          <p className="text-xs text-muted-foreground">
            Premi il bottone per sbloccare e avviare la corsa
          </p>
        </div>

        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Sblocco fallito</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={isPending}
          onClick={handleUnlock}
        >
          {isPending ? 'Sblocco in corso…' : 'Sblocca & Avvia corsa'}
        </Button>
      </div>
    </AppLayout>
  );
}
