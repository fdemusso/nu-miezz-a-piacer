import { useState, useEffect, useRef, useCallback } from 'react'

interface UseCountdownOptions {
  expiresAt: string | number | undefined
  onExpire?: () => void
}

export function useCountdown({ expiresAt, onExpire }: UseCountdownOptions) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const onExpireRef = useRef(onExpire)

  // Keep callback ref fresh to avoid resetting interval on callback changes
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const calculateSecondsLeft = useCallback((): number => {
    if (!expiresAt) return 0
    const expiry = typeof expiresAt === 'string' ? new Date(expiresAt).getTime() : expiresAt
    const deltaMs = expiry - Date.now()
    return Math.max(0, Math.floor(deltaMs / 1000))
  }, [expiresAt])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const updateCountdown = useCallback(() => {
    const remaining = calculateSecondsLeft()
    setSecondsLeft(remaining)

    if (remaining <= 0) {
      clearTimer()
      if (onExpireRef.current) {
        onExpireRef.current()
      }
    }
  }, [calculateSecondsLeft, clearTimer])

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0)
      return
    }

    // Set initial value
    const initialRemaining = calculateSecondsLeft()
    setSecondsLeft(initialRemaining)

    if (initialRemaining <= 0) {
      if (onExpireRef.current) {
        onExpireRef.current()
      }
      return
    }

    // Start interval
    timerRef.current = setInterval(updateCountdown, 1000)

    // Handle tab visibility / window focus to recalculate
    const handleFocus = () => {
      updateCountdown()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('visibilitychange', handleFocus)

    return () => {
      clearTimer()
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('visibilitychange', handleFocus)
    }
  }, [expiresAt, calculateSecondsLeft, updateCountdown, clearTimer])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return {
    formattedTime,
    secondsLeft,
    isExpired: secondsLeft <= 0,
    clearTimer
  }
}
