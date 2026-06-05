import { NavLink } from 'react-router-dom'

export function BottomNav() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0', background: '#fff', borderTop: '1px solid #e0e0e0' }}>
      <NavLink to="/">Mappa</NavLink>
      <NavLink to="/payment-methods">Pagamenti</NavLink>
      <NavLink to="/support/new">Supporto</NavLink>
    </nav>
  )
}
