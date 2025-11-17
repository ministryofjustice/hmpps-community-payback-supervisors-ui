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

export type ValidationErrors<T> = Partial<Record<keyof T, Record<'text', string>>>
