export interface SuspendUserAccountRequest {
  userId: string
}

export interface SuspendUserAccountResponse {
  suspended: boolean
  userId: string
}
