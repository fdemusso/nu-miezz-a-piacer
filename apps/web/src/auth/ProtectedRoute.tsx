/**
 * ProtectedRoute — guard per tutte le route autenticate.
 *
 * Se l'utente non è loggato → redirect a /login (preserve della location
 * non implementato per semplicità, si torna sempre a /).
 *
 * Uso in App.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/" element={<HomePage />} />
 *     ...
 *   </Route>
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
