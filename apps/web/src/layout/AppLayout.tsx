/**
 * AppLayout — shell comune a tutte le pagine protette.
 *
 * Topbar: mostra il nome utente loggato + pulsante logout.
 * Outlet: contenuto della route corrente.
 * BottomNav: navigazione principale mobile.
 *
 * Il logout rimuove la sessione da localStorage e reindirizza al login
 * (ProtectedRoute in App.tsx intercetta il mancato token).
 */

import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar minimalista — mostra chi è loggato */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background text-sm shrink-0">
        <span className="font-semibold text-foreground">
          nu miezz a piacer
        </span>
        {user && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="hidden sm:inline">{user.name}</span>
            <button
              onClick={handleLogout}
              title="Esci"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Esci</span>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
