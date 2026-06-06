'use client';

import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle, Timer, PauseCircle, PlayCircle,
  CheckCircle2, MapPin, Euro, Car,
} from 'lucide-react';
import { usePauseRide } from './PauseRide.hook';
import { useEndRide } from '../EndRide/EndRide.hook';
import { useRestoreSession } from '../RestoreSession/RestoreSession.hook';
import { useAppStore } from '@/stores/app.store';
import { RideStatus } from '@mvp/contracts';

const DEMO_USER_ID = 'u1';
const DEMO_END_COORDS = { lat: 45.4661, lng: 9.1872 };
const DEMO_DISTANCE_KM = 2.3;

export function PauseRidePage() {
  const router = useRouter();
  useRestoreSession();

  const activeRide = useAppStore((s) => s.activeRide);
  const { pauseRide, resumeRide, isPausing, isResuming, error: pauseError } = usePauseRide();
  const { endRide, endedRide, totalCost, isPending: isEnding, error: endError } = useEndRide();

  const error = pauseError ?? endError;

  // Post-ride summary
  if (endedRide && totalCost) {
    const duration = endedRide.durationMinutes != null ? Math.round(endedRide.durationMinutes) : null;
    return (
      <AppLayout title="Corsa completata">
        <div className="flex flex-col min-h-[calc(100dvh-8rem)] p-4 gap-4">
          <div className="space-y-4">
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
          </div>

          <div className="mt-auto">
            <Button className="w-full" size="lg" onClick={() => router.push('/')}>
              Torna alla home
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // No active ride
  if (!activeRide) {
    return (
      <AppLayout title="Corsa in corso">
        <div className="flex flex-col min-h-[calc(100dvh-8rem)] p-4 gap-4">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-amber-900">Nessuna corsa attiva trovata.</p>
              <p className="text-xs text-muted-foreground mt-1">Avvia prima una corsa sbloccando un veicolo.</p>
            </CardContent>
          </Card>
          <div className="mt-auto">
            <Button variant="outline" className="w-full" size="lg" onClick={() => router.push('/')}>
              Torna alla home
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isPaused = activeRide.status === RideStatus.PAUSED;
  const isActive = activeRide.status === RideStatus.ACTIVE;
  const isBusy = isPausing || isResuming || isEnding;

  async function handlePause() {
    await pauseRide(activeRide!.id, DEMO_USER_ID);
  }

  async function handleResume() {
    await resumeRide(activeRide!.id, DEMO_USER_ID);
  }

  async function handleEnd() {
    await endRide(activeRide!.id, DEMO_USER_ID, DEMO_END_COORDS, DEMO_DISTANCE_KM);
  }

  return (
    <AppLayout title="Corsa in corso">
      <div className="flex flex-col min-h-[calc(100dvh-8rem)] p-4 gap-4">
        <div className="space-y-4">
          <Card className={isPaused ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${isPaused ? 'text-amber-900' : 'text-green-900'}`}>
                    {isPaused ? 'Corsa in pausa' : 'Corsa in corso'}
                  </p>
                  <p className={`text-sm mt-0.5 ${isPaused ? 'text-amber-700' : 'text-green-700'}`}>
                    {isPaused ? 'Il veicolo è fermo, pronto alla ripresa.' : 'Il veicolo è attivo.'}
                  </p>
                </div>
                {isPaused ? (
                  <PauseCircle className="h-8 w-8 text-amber-500 shrink-0" />
                ) : (
                  <PlayCircle className="h-8 w-8 text-green-500 shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Inizio corsa</span>
                <span className="ml-auto font-medium">
                  {new Date(activeRide.startedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Stato</span>
                <Badge className="ml-auto" variant={isPaused ? 'secondary' : 'default'}>
                  {isPaused ? 'In pausa' : 'In corso'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">ID corsa</span>
                <span className="ml-auto font-mono text-xs">{activeRide.id.slice(0, 8)}…</span>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Errore</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-auto space-y-2">
          {isActive && (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              disabled={isBusy}
              onClick={handlePause}
            >
              <PauseCircle className="h-5 w-5 mr-2" />
              {isPausing ? 'Pausa in corso…' : 'Metti in pausa'}
            </Button>
          )}

          {isPaused && (
            <Button
              className="w-full"
              size="lg"
              disabled={isBusy}
              onClick={handleResume}
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              {isResuming ? 'Ripresa in corso…' : 'Riprendi corsa'}
            </Button>
          )}

          <Button
            variant="destructive"
            className="w-full"
            size="lg"
            disabled={isBusy}
            onClick={handleEnd}
          >
            {isEnding ? 'Chiusura in corso…' : 'Termina corsa'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
