import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="app-shell">
      <main className="page-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
