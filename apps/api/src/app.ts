import express from 'express'
import { container } from './composition/container'
import { healthRouter } from './slices/Health/Health.router'
import { makeAuthRouter } from './slices/Auth/Auth.router'
import { makeNearbyVehiclesRouter } from './slices/NearbyVehicles/NearbyVehicles.router'
import { makeBookVehicleRouter } from './slices/BookVehicle/BookVehicle.router'
import { makeEstimateRideCostRouter } from './slices/EstimateRideCost/EstimateRideCost.router'
import { makeEndRideRouter } from './slices/EndRide/EndRide.router'
import { makeRideSummaryRouter } from './slices/RideSummary/RideSummary.router'
import { makeVehicleDetailsRouter } from './slices/VehicleDetails/VehicleDetails.router'
import { makeEstimateWalkTimeRouter } from './slices/EstimateWalkTime/EstimateWalkTime.router'
import { makeSuggestBestVehicleRouter } from './slices/SuggestBestVehicle/SuggestBestVehicle.router'
import { makeApplyPromotionRouter } from './slices/ApplyPromotion/ApplyPromotion.router'
import { makeOpenSupportTicketRouter } from './slices/OpenSupportTicket/OpenSupportTicket.router'
import { makeReportDamagedVehicleRouter } from './slices/ReportDamagedVehicle/ReportDamagedVehicle.router'
import { makeVehicleBatteryStatusRouter } from './slices/VehicleBatteryStatus/VehicleBatteryStatus.router'
import { makeUnlockVehicleRouter } from './slices/UnlockVehicle/UnlockVehicle.router'
import { makeUnlockMethodRouter } from './slices/UnlockMethod/UnlockMethod.router'
import { makeManagePaymentMethodRouter } from './slices/ManagePaymentMethod/ManagePaymentMethod.router'
import { makePauseRideRouter } from './slices/PauseRide/PauseRide.router'
import { makeUsageFrequencyReportRouter } from './slices/UsageFrequencyReport/UsageFrequencyReport.router'
import { makeMobilityPeriodicReportRouter } from './slices/MobilityPeriodicReport/MobilityPeriodicReport.router'
import { makeMarkUrbanWarningZoneRouter } from './slices/MarkUrbanWarningZone/MarkUrbanWarningZone.router'
import { makeHighDensityZoneMapRouter } from './slices/HighDensityZoneMap/HighDensityZoneMap.router'
import { makeDefineSensitiveZoneRouter } from './slices/DefineSensitiveZone/DefineSensitiveZone.router'
import { makeFleetDistributionMapRouter } from './slices/FleetDistributionMap/FleetDistributionMap.router'
import { makeLowAvailabilityAlertRouter } from './slices/LowAvailabilityAlert/LowAvailabilityAlert.router'
import { makeReceiveMalfunctionReportRouter } from './slices/ReceiveMalfunctionReport/ReceiveMalfunctionReport.router'
import { makeVerifyParkingPositionRouter } from './slices/VerifyParkingPosition/VerifyParkingPosition.router'
import { makeMaintenanceQueueRouter } from './slices/MaintenanceQueue/MaintenanceQueue.router'
import { makeVehicleGPSHistoryRouter } from './slices/VehicleGPSHistory/VehicleGPSHistory.router'
import { makeManageSupportTicketsRouter } from './slices/ManageSupportTickets/ManageSupportTickets.router'
import { makeConfigureParkingBonusRouter } from './slices/ConfigureParkingBonus/ConfigureParkingBonus.router'
import { makeSuspendUserAccountRouter } from './slices/SuspendUserAccount/SuspendUserAccount.router'
import { makeRemoteLockVehicleRouter } from './slices/RemoteLockVehicle/RemoteLockVehicle.router'
import { makeExpiredBookingsMonitorRouter } from './slices/ExpiredBookingsMonitor/ExpiredBookingsMonitor.router'

const app = express()
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api', makeAuthRouter(container.auth))
app.use('/api', makeNearbyVehiclesRouter(container.nearbyVehicles))
app.use('/api', makeBookVehicleRouter(container.bookVehicle))
app.use('/api', makeEstimateRideCostRouter(container.estimateRideCost))
app.use('/api', makeEndRideRouter(container.endRide))
app.use('/api', makeRideSummaryRouter(container.rideSummary))
app.use('/api', makeVehicleDetailsRouter(container.vehicleDetails))
app.use('/api', makeEstimateWalkTimeRouter(container.estimateWalkTime))
app.use('/api', makeSuggestBestVehicleRouter(container.suggestBestVehicle))
app.use('/api', makeApplyPromotionRouter(container.applyPromotion))
app.use('/api', makeOpenSupportTicketRouter(container.openSupportTicket))
app.use('/api', makeReportDamagedVehicleRouter(container.reportDamagedVehicle))
app.use('/api', makeVehicleBatteryStatusRouter(container.vehicleBatteryStatus))
app.use('/api', makeUnlockVehicleRouter(container.unlockVehicle))
app.use('/api', makeUnlockMethodRouter(container.unlockMethod))
app.use('/api', makeManagePaymentMethodRouter(container.managePaymentMethod))
app.use('/api', makePauseRideRouter(container.pauseRide))
app.use('/api', makeUsageFrequencyReportRouter(container.usageFrequencyReport))
app.use('/api', makeMobilityPeriodicReportRouter(container.mobilityPeriodicReport))
app.use('/api', makeMarkUrbanWarningZoneRouter(container.markUrbanWarningZone))
app.use('/api', makeHighDensityZoneMapRouter(container.highDensityZoneMap))
app.use('/api', makeDefineSensitiveZoneRouter(container.defineSensitiveZone))
app.use('/api', makeFleetDistributionMapRouter(container.fleetDistributionMap))
app.use('/api', makeLowAvailabilityAlertRouter(container.lowAvailabilityAlert))
app.use('/api', makeReceiveMalfunctionReportRouter(container.receiveMalfunctionReport))
app.use('/api', makeVerifyParkingPositionRouter(container.verifyParkingPosition))
app.use('/api', makeMaintenanceQueueRouter(container.maintenanceQueue))
app.use('/api', makeVehicleGPSHistoryRouter(container.vehicleGPSHistory))
app.use('/api', makeManageSupportTicketsRouter(container.manageSupportTickets))
app.use('/api', makeConfigureParkingBonusRouter(container.configureParkingBonus))
app.use('/api', makeSuspendUserAccountRouter(container.suspendUserAccount))
app.use('/api', makeRemoteLockVehicleRouter(container.remoteLockVehicle))
app.use('/api', makeExpiredBookingsMonitorRouter(container.expiredBookingsMonitor))

export default app
