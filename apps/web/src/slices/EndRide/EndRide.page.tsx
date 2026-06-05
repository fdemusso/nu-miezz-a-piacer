'use client';

import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Timer, MapPin, Euro, Car } from 'lucide-react';
import { useEndRide } from './EndRide.hook';
import { useAppStore } from '@/stores/app.store';

const DEMO_USER_ID = 'u1';
const DEMO_END_COORDS = { lat: 45.4661, lng: 9.1872 };
const DEMO_DISTANCE_KM = 2.3;

export function EndRidePage() {
  const router = useRouter();
  const activeRide = useAppStore((s) => s.activeRide);
  const { endRide, endedRide, totalCost, isPending, error } = useEndRide();

  async function handleEndRide() {
    if (!activeRide) return;
    await endRide(activeRide.id, DEMO_USER_ID, DEMO_END_COORDS, DEMO_DISTANCE_KM);
  }

  if (!activeRide && !endedRide) {
    return (
      <AppLayout title="Termina corsa" hideNav>
        <div className="p-4 space-y-4">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-amber-900">Nessuna corsa attiva trovata.</p>
              <p className="text-xs text-muted-foreground mt-1">Avvia prima una corsa sbloccando un veicolo.</p>
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
            Torna alla home
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (endedRide && totalCost) {
    const duration = endedRide.durationMinutes != null ? Math.round(endedRide.durationMinutes) : null;

    return (
      <AppLayout title="Corsa completata" hideNav>
        <div className="p-4 space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">Corsa terminata!</p>
                  <p className="text-sm text-green-700 mt-0.5">Il mezzo è nuovamente disponibile.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Inizio</span>
                <span className="ml-auto font-medium">
                  {new Date(endedRide.startedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {endedRide.endedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fine</span>
                  <span className="ml-auto font-medium">
                    {new Date(endedRide.endedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              {duration != null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Durata</span>
                  <span className="ml-auto font-medium">{duration} min</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Distanza</span>
                <span className="ml-auto font-medium">{endedRide.distanceKm ?? DEMO_DISTANCE_KM} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Costo totale</span>
                <span className="ml-auto font-semibold text-base">
                  {totalCost.amount.toFixed(2)} {totalCost.currency}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Parcheggio</span>
                <Badge className="ml-auto" variant="default">Zona valida</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Stato mezzo</span>
                <Badge className="ml-auto" variant="secondary">Disponibile</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">ID corsa</span>
                <span className="ml-auto font-mono text-xs">{endedRide.id.slice(0, 8)}…</span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={() => router.push('/')}>
            Torna alla home
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Termina corsa" hideNav>
      <div className="p-4 space-y-4">
        {activeRide && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Corsa iniziata alle</span>
                <span className="ml-auto font-medium">
                  {new Date(activeRide.startedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Stato</span>
                <Badge className="ml-auto" variant="default">In corso</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">ID corsa</span>
                <span className="ml-auto font-mono text-xs">{activeRide.id.slice(0, 8)}…</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="rounded-lg border bg-muted/30 p-4 text-center space-y-1">
          <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Posizione di fine corsa</p>
          <p className="text-xs text-muted-foreground">
            Assicurati di parcheggiare in una zona valida prima di terminare
          </p>
        </div>

        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Errore nella chiusura</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          disabled={isPending || !activeRide}
          onClick={handleEndRide}
        >
          {isPending ? 'Chiusura in corso…' : 'Termina corsa'}
        </Button>
      </div>
    </AppLayout>
  );
}
