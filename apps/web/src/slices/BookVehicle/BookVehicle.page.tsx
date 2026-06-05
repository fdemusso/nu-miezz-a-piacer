import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useBookVehicle } from './BookVehicle.hook'
import { MapPlaceholder } from './MapPlaceholder'

export function BookVehiclePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const {
    status,
    formattedTime,
    cancel,
    navigate,
  } = useBookVehicle(vehicleId)

  // Stato di caricamento
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-16 w-32 rounded-lg" />
        <Skeleton className="h-28 w-full max-w-md rounded-2xl" />
        <div className="flex gap-4 w-full max-w-md">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] md:min-h-0 md:items-center md:justify-center md:py-12">

      {/* Contenitore principale — fluido, centrato su desktop */}
      <div className="flex flex-col flex-1 md:flex-none w-full max-w-lg md:max-w-2xl mx-auto px-5 py-6 md:px-8 md:py-10">

        {/* Header placeholder (mobile) */}
        <div className="flex items-center gap-3 pb-4 mb-6 md:hidden select-none">
          <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
          <div className="flex-1">
            <div className="h-3 w-full max-w-[60%] bg-muted rounded" />
          </div>
        </div>

        {/* Sezione Timer */}
        <div className="text-center space-y-2 mb-8 md:mb-10">
          <p className="text-sm md:text-base font-medium text-muted-foreground md:tracking-widest md:uppercase">
            Veicolo prenotato
          </p>
          <h1 className="text-6xl md:text-8xl font-light md:font-extralight tracking-tight tabular-nums text-[#5C6BC0]">
            {formattedTime}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            tempo rimasto per raggiungerlo
          </p>
        </div>

        {/* Card Veicolo */}
        <Card className="rounded-2xl border bg-card shadow-sm mb-5 md:mb-8">
          <CardContent className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
            <div className="w-11 h-11 md:w-14 md:h-14 bg-muted rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 md:w-7 md:h-7 text-muted-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3C13 6.8 11.5 6 10 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1" />
                <circle cx="7" cy="17" r="3" />
                <circle cx="17" cy="17" r="3" />
              </svg>
            </div>
            <div className="space-y-1.5 md:space-y-2 flex-1">
              <div className="h-3 md:h-4 w-32 md:w-[60%] bg-muted-foreground/15 rounded" />
              <div className="h-2.5 md:h-3 w-20 md:w-[40%] bg-muted-foreground/15 rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Mappa — solo mobile */}
        <div className="md:hidden mb-5">
          <MapPlaceholder />
        </div>

        {/* Pulsanti d'Azione */}
        {/* Mobile: stacked verticale (Naviga in alto, Annulla sotto) */}
        {/* Desktop: affiancati orizzontale (Annulla sx, Naviga dx) */}
        <div className="flex flex-col md:flex-row-reverse gap-3 mt-auto md:mt-0">
          <Button
            onClick={navigate}
            disabled={status === 'cancelling'}
            className="w-full md:flex-1 bg-[#5C6BC0] hover:bg-[#4d5aa6] text-white font-semibold h-12 rounded-xl shadow-sm transition-all"
          >
            <span className="md:hidden">Naviga 🚶</span>
            <span className="hidden md:inline">Naviga</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={status === 'cancelling'}
                className="w-full md:flex-1 h-12 rounded-xl font-medium text-[#5C6BC0] border-[#5C6BC0]/30 hover:bg-[#5C6BC0]/5 hover:border-[#5C6BC0]/50"
              >
                <span className="md:hidden">Annulla prenotazione</span>
                <span className="hidden md:inline">Annulla</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl max-w-[92%] md:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro di voler annullare?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione cancellerà la tua prenotazione attuale. Il veicolo tornerà disponibile per gli altri utenti.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl">Chiudi</AlertDialogCancel>
                <AlertDialogAction
                  onClick={cancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                >
                  Sì, annulla
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

      </div>
    </div>
  )
}
