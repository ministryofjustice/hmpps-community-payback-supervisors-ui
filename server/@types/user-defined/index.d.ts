export interface BaseRequest {
  username: string
}

export interface GetSessionRequest extends BaseRequest {
  projectCode: string
  date: string
}

export interface GetAppointmentRequest extends BaseRequest {
  projectCode: string
  appointmentId: string
}
