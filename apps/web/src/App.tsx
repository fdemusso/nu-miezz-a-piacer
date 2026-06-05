/**
 * App.tsx — root del router.
 *
 * Struttura:
 *   /login            → LoginPage (pubblica, fuori da AppLayout e ProtectedRoute)
 *   /* tutto il resto → ProtectedRoute → AppLayout → slice pages
 *
 * ProtectedRoute reindirizza a /login se l'utente non è autenticato.
 * AuthProvider gestisce il token in localStorage.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { AppLayout } from './layout/AppLayout'

// ─── Customer slices ──────────────────────────────────────────────────────────
import { NearbyVehiclesPage }      from './slices/NearbyVehicles/NearbyVehicles.page'
import { BookVehiclePage }         from './slices/BookVehicle/BookVehicle.page'
import { EstimateRideCostPage }    from './slices/EstimateRideCost/EstimateRideCost.page'
import { EndRidePage }             from './slices/EndRide/EndRide.page'
import { RideSummaryPage }         from './slices/RideSummary/RideSummary.page'
import { VehicleDetailsPage }      from './slices/VehicleDetails/VehicleDetails.page'
import { EstimateWalkTimePage }    from './slices/EstimateWalkTime/EstimateWalkTime.page'
import { SuggestBestVehiclePage }  from './slices/SuggestBestVehicle/SuggestBestVehicle.page'
import { ApplyPromotionPage }      from './slices/ApplyPromotion/ApplyPromotion.page'
import { OpenSupportTicketPage }   from './slices/OpenSupportTicket/OpenSupportTicket.page'
import { ReportDamagedVehiclePage }from './slices/ReportDamagedVehicle/ReportDamagedVehicle.page'
import { VehicleBatteryStatusPage }from './slices/VehicleBatteryStatus/VehicleBatteryStatus.page'
import { UnlockVehiclePage }       from './slices/UnlockVehicle/UnlockVehicle.page'
import { UnlockMethodPage }        from './slices/UnlockMethod/UnlockMethod.page'
import { ManagePaymentMethodPage } from './slices/ManagePaymentMethod/ManagePaymentMethod.page'
import { PauseRidePage }           from './slices/PauseRide/PauseRide.page'

// ─── Operator slices ──────────────────────────────────────────────────────────
import { FleetDistributionMapPage }    from './slices/FleetDistributionMap/FleetDistributionMap.page'
import { LowAvailabilityAlertPage }    from './slices/LowAvailabilityAlert/LowAvailabilityAlert.page'
import { ReceiveMalfunctionReportPage }from './slices/ReceiveMalfunctionReport/ReceiveMalfunctionReport.page'
import { VerifyParkingPositionPage }   from './slices/VerifyParkingPosition/VerifyParkingPosition.page'
import { MaintenanceQueuePage }        from './slices/MaintenanceQueue/MaintenanceQueue.page'
import { VehicleGPSHistoryPage }       from './slices/VehicleGPSHistory/VehicleGPSHistory.page'
import { ManageSupportTicketsPage }    from './slices/ManageSupportTickets/ManageSupportTickets.page'
import { ConfigureParkingBonusPage }   from './slices/ConfigureParkingBonus/ConfigureParkingBonus.page'
import { SuspendUserAccountPage }      from './slices/SuspendUserAccount/SuspendUserAccount.page'
import { RemoteLockVehiclePage }       from './slices/RemoteLockVehicle/RemoteLockVehicle.page'
import { ExpiredBookingsMonitorPage }  from './slices/ExpiredBookingsMonitor/ExpiredBookingsMonitor.page'

// ─── Admin slices ─────────────────────────────────────────────────────────────
import { UsageFrequencyReportPage }  from './slices/UsageFrequencyReport/UsageFrequencyReport.page'
import { MobilityPeriodicReportPage }from './slices/MobilityPeriodicReport/MobilityPeriodicReport.page'
import { MarkUrbanWarningZonePage }  from './slices/MarkUrbanWarningZone/MarkUrbanWarningZone.page'
import { HighDensityZoneMapPage }    from './slices/HighDensityZoneMap/HighDensityZoneMap.page'
import { DefineSensitiveZonePage }   from './slices/DefineSensitiveZone/DefineSensitiveZone.page'

export default function App() {
  return (
    <AuthProvider>
      {/* Toaster per notifiche (errori login, successi, ecc.) */}
      <Toaster position="top-center" richColors />

      <BrowserRouter>
        <Routes>
          {/* ── Pagina pubblica ─────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Pagine protette: richiedono login ───────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {/* Customer */}
              <Route path="/"                        element={<NearbyVehiclesPage />} />
              <Route path="/book/:vehicleId"          element={<BookVehiclePage />} />
              <Route path="/estimate-cost"            element={<EstimateRideCostPage />} />
              <Route path="/end-ride"                 element={<EndRidePage />} />
              <Route path="/ride-summary/:rideId"     element={<RideSummaryPage />} />
              <Route path="/vehicle/:vehicleId"       element={<VehicleDetailsPage />} />
              <Route path="/walk-time"                element={<EstimateWalkTimePage />} />
              <Route path="/suggest"                  element={<SuggestBestVehiclePage />} />
              <Route path="/promotions"               element={<ApplyPromotionPage />} />
              <Route path="/support/new"              element={<OpenSupportTicketPage />} />
              <Route path="/report-damage"            element={<ReportDamagedVehiclePage />} />
              <Route path="/battery/:vehicleId"       element={<VehicleBatteryStatusPage />} />
              <Route path="/unlock/:vehicleId"        element={<UnlockVehiclePage />} />
              <Route path="/unlock-method/:vehicleId" element={<UnlockMethodPage />} />
              <Route path="/payment-methods"          element={<ManagePaymentMethodPage />} />
              <Route path="/pause-ride"               element={<PauseRidePage />} />

              {/* Operator */}
              <Route path="/op/fleet"               element={<FleetDistributionMapPage />} />
              <Route path="/op/alerts"              element={<LowAvailabilityAlertPage />} />
              <Route path="/op/reports"             element={<ReceiveMalfunctionReportPage />} />
              <Route path="/op/parking-verify"      element={<VerifyParkingPositionPage />} />
              <Route path="/op/maintenance"         element={<MaintenanceQueuePage />} />
              <Route path="/op/gps/:vehicleId"      element={<VehicleGPSHistoryPage />} />
              <Route path="/op/tickets"             element={<ManageSupportTicketsPage />} />
              <Route path="/op/parking-bonus"       element={<ConfigureParkingBonusPage />} />
              <Route path="/op/suspend-user"        element={<SuspendUserAccountPage />} />
              <Route path="/op/remote-lock"         element={<RemoteLockVehiclePage />} />
              <Route path="/op/expired-bookings"    element={<ExpiredBookingsMonitorPage />} />

              {/* Admin */}
              <Route path="/admin/usage"            element={<UsageFrequencyReportPage />} />
              <Route path="/admin/mobility-report"  element={<MobilityPeriodicReportPage />} />
              <Route path="/admin/warning-zone"     element={<MarkUrbanWarningZonePage />} />
              <Route path="/admin/heatmap"          element={<HighDensityZoneMapPage />} />
              <Route path="/admin/sensitive-zone"   element={<DefineSensitiveZonePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
