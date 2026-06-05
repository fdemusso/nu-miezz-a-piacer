import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/auth/AuthContext'
import type { Booking } from '@vsa/contracts'
import type { BookVehicleViewState } from './BookVehicle.types'
import { useCountdown } from './useCountdown'

const STORAGE_KEY = 'nmap_active_booking'

export function useBookVehicle(vehicleId: string | undefined): BookVehicleViewState {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [status, setStatus] = useState<BookVehicleViewState['status']>('idle')
  const [booking, setBooking] = useState<Booking | null>(null)

  // Setup countdown timer
  const { formattedTime, secondsLeft, isExpired, clearTimer } = useCountdown({
    expiresAt: booking?.expiresAt ? new Date(booking.expiresAt).getTime() : undefined,
    onExpire: () => {
      setStatus('idle')
      setBooking(null)
      localStorage.removeItem(STORAGE_KEY)
      toast.error('Prenotazione scaduta', {
        description: 'Il tempo a disposizione per raggiungere il veicolo è terminato.',
      })
      navigate('/')
    },
  })

  // Inizializzazione della prenotazione
  useEffect(() => {
    if (!vehicleId || !user) return

    // 1. Controlla se c'è già una prenotazione attiva in localStorage per questo veicolo
    try {
      const storedRaw = localStorage.getItem(STORAGE_KEY)
      if (storedRaw) {
        const stored = JSON.parse(storedRaw) as Booking
        const expiryTime = new Date(stored.expiresAt).getTime()
        
        if (stored.vehicleId === vehicleId && expiryTime > Date.now()) {
          setBooking(stored)
          setStatus('booked')
          return
        }
      }
    } catch (e) {
      console.error('Error reading active booking from localStorage', e)
    }

    // 2. Altrimenti invoca l'azione che genera il Booking chiamando le API
    const bookVehicle = async () => {
      setStatus('loading')
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ vehicleId }),
        })

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}))
          throw new Error(errBody.error || 'Errore durante la prenotazione')
        }

        const data = await res.json() as { booking: Booking }
        setBooking(data.booking)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.booking))
        setStatus('booked')
      } catch (err: any) {
        setStatus('error')
        toast.error('Errore prenotazione', {
          description: err.message || 'Non è stato possibile prenotare il veicolo.',
        })
      }
    }

    bookVehicle()
  }, [vehicleId, user])

  // Flusso di Annullamento (cancel)
  const cancel = useCallback(async () => {
    if (!booking || !user) return

    setStatus('cancelling')
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || 'Errore durante l\'annullamento')
      }

      // Interrompe il timer e pulisce lo stato
      clearTimer()
      setStatus('idle')
      setBooking(null)
      localStorage.removeItem(STORAGE_KEY)

      toast.success('Prenotazione annullata', {
        description: 'Hai annullato la prenotazione con successo.',
      })
      navigate('/')
    } catch (err: any) {
      setStatus('booked') // Ripristina lo stato booked in caso di fallimento
      toast.error('Errore annullamento', {
        description: err.message || 'Non è stato possibile annullare la prenotazione.',
      })
    }
  }, [booking, user, clearTimer, navigate])

  // Flusso di sblocco/navigazione
  const handleNavigate = useCallback(() => {
    if (!vehicleId) return
    clearTimer()
    localStorage.removeItem(STORAGE_KEY)
    navigate(`/unlock/${vehicleId}`)
  }, [vehicleId, clearTimer, navigate])

  return {
    status,
    booking,
    formattedTime,
    secondsLeft,
    isExpired,
    cancel,
    navigate: handleNavigate,
    clearTimer,
  }
}
