export interface ExpiredBookingsMonitorRequest {
  // no input needed — cron sweep
}

export interface ExpiredBookingsMonitorResponse {
  swept: number
}
