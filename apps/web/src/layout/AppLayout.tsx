import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
