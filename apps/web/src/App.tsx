import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { NearbyVehiclesPage } from './slices/NearbyVehicles/NearbyVehicles.page'
import { BookVehiclePage } from './slices/BookVehicle/BookVehicle.page'
import { EstimateRideCostPage } from './slices/EstimateRideCost/EstimateRideCost.page'
import { EndRidePage } from './slices/EndRide/EndRide.page'
import { PauseRidePage } from './slices/PauseRide/PauseRide.page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Home — Mappa veicoli vicini */}
          <Route path="/" element={<NearbyVehiclesPage />} />

          {/* Prenotazione veicolo */}
          <Route path="/prenota" element={<BookVehiclePage />} />

          {/* Stima costo corsa */}
          <Route path="/tariffe" element={<EstimateRideCostPage />} />

          {/* Corsa attiva */}
          <Route path="/corsa" element={<PauseRidePage />} />

          {/* Fine corsa */}
          <Route path="/fine-corsa" element={<EndRidePage />} />

          {/* Fallback → Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
