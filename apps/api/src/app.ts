import express from 'express'
import { nearbyVehiclesRouter } from './slices/NearbyVehicles/NearbyVehicles.router'
import { bookVehicleRouter } from './slices/BookVehicle/BookVehicle.router'
import { estimateRideCostRouter } from './slices/EstimateRideCost/EstimateRideCost.router'
import { endRideRouter } from './slices/EndRide/EndRide.router'
import { rideSummaryRouter } from './slices/RideSummary/RideSummary.router'
import { vehicleDetailsRouter } from './slices/VehicleDetails/VehicleDetails.router'
import { estimateWalkTimeRouter } from './slices/EstimateWalkTime/EstimateWalkTime.router'
import { suggestBestVehicleRouter } from './slices/SuggestBestVehicle/SuggestBestVehicle.router'
import { applyPromotionRouter } from './slices/ApplyPromotion/ApplyPromotion.router'
import { openSupportTicketRouter } from './slices/OpenSupportTicket/OpenSupportTicket.router'
import { reportDamagedVehicleRouter } from './slices/ReportDamagedVehicle/ReportDamagedVehicle.router'
import { vehicleBatteryStatusRouter } from './slices/VehicleBatteryStatus/VehicleBatteryStatus.router'
import { unlockVehicleRouter } from './slices/UnlockVehicle/UnlockVehicle.router'
import { unlockMethodRouter } from './slices/UnlockMethod/UnlockMethod.router'
import { managePaymentMethodRouter } from './slices/ManagePaymentMethod/ManagePaymentMethod.router'
import { pauseRideRouter } from './slices/PauseRide/PauseRide.router'
import { usageFrequencyReportRouter } from './slices/UsageFrequencyReport/UsageFrequencyReport.router'
import { mobilityPeriodicReportRouter } from './slices/MobilityPeriodicReport/MobilityPeriodicReport.router'
import { markUrbanWarningZoneRouter } from './slices/MarkUrbanWarningZone/MarkUrbanWarningZone.router'
import { highDensityZoneMapRouter } from './slices/HighDensityZoneMap/HighDensityZoneMap.router'
import { defineSensitiveZoneRouter } from './slices/DefineSensitiveZone/DefineSensitiveZone.router'
import { fleetDistributionMapRouter } from './slices/FleetDistributionMap/FleetDistributionMap.router'
import { lowAvailabilityAlertRouter } from './slices/LowAvailabilityAlert/LowAvailabilityAlert.router'
import { receiveMalfunctionReportRouter } from './slices/ReceiveMalfunctionReport/ReceiveMalfunctionReport.router'
import { verifyParkingPositionRouter } from './slices/VerifyParkingPosition/VerifyParkingPosition.router'
import { maintenanceQueueRouter } from './slices/MaintenanceQueue/MaintenanceQueue.router'
import { vehicleGPSHistoryRouter } from './slices/VehicleGPSHistory/VehicleGPSHistory.router'
import { manageSupportTicketsRouter } from './slices/ManageSupportTickets/ManageSupportTickets.router'
import { configureParkingBonusRouter } from './slices/ConfigureParkingBonus/ConfigureParkingBonus.router'
import { suspendUserAccountRouter } from './slices/SuspendUserAccount/SuspendUserAccount.router'
import { remoteLockVehicleRouter } from './slices/RemoteLockVehicle/RemoteLockVehicle.router'
import { expiredBookingsMonitorRouter } from './slices/ExpiredBookingsMonitor/ExpiredBookingsMonitor.router'

const app = express()
app.use(express.json())

app.use('/api', nearbyVehiclesRouter)
app.use('/api', bookVehicleRouter)
app.use('/api', estimateRideCostRouter)
app.use('/api', endRideRouter)
app.use('/api', rideSummaryRouter)
app.use('/api', vehicleDetailsRouter)
app.use('/api', estimateWalkTimeRouter)
app.use('/api', suggestBestVehicleRouter)
app.use('/api', applyPromotionRouter)
app.use('/api', openSupportTicketRouter)
app.use('/api', reportDamagedVehicleRouter)
app.use('/api', vehicleBatteryStatusRouter)
app.use('/api', unlockVehicleRouter)
app.use('/api', unlockMethodRouter)
app.use('/api', managePaymentMethodRouter)
app.use('/api', pauseRideRouter)
app.use('/api', usageFrequencyReportRouter)
app.use('/api', mobilityPeriodicReportRouter)
app.use('/api', markUrbanWarningZoneRouter)
app.use('/api', highDensityZoneMapRouter)
app.use('/api', defineSensitiveZoneRouter)
app.use('/api', fleetDistributionMapRouter)
app.use('/api', lowAvailabilityAlertRouter)
app.use('/api', receiveMalfunctionReportRouter)
app.use('/api', verifyParkingPositionRouter)
app.use('/api', maintenanceQueueRouter)
app.use('/api', vehicleGPSHistoryRouter)
app.use('/api', manageSupportTicketsRouter)
app.use('/api', configureParkingBonusRouter)
app.use('/api', suspendUserAccountRouter)
app.use('/api', remoteLockVehicleRouter)
app.use('/api', expiredBookingsMonitorRouter)

export default app
