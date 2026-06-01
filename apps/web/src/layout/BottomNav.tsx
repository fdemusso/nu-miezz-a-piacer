import { NavLink } from 'react-router-dom'

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigazione principale">
      <NavLink to="/" end>
        <span className="nav-icon">
          {/* Map / Pin icon */}
          <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </span>
        Mappa
      </NavLink>

      <NavLink to="/prenota">
        <span className="nav-icon">
          {/* Calendar / Book icon */}
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        Prenota
      </NavLink>

      <NavLink to="/tariffe">
        <span className="nav-icon">
          {/* Euro / Cost icon */}
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h5M8 9.5h5.5a3.5 3.5 0 0 1 0 5H8" />
          </svg>
        </span>
        Tariffe
      </NavLink>

      <NavLink to="/fine-corsa">
        <span className="nav-icon">
          {/* Flag / Finish icon */}
          <svg viewBox="0 0 24 24">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </span>
        Fine Corsa
      </NavLink>
    </nav>
  )
}
