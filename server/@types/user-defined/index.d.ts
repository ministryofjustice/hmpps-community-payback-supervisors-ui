import { UpdateAppointmentOutcomeDto } from '../shared'

export interface BaseRequest {
  username: string
}

export interface GetSessionRequest extends BaseRequest {
  projectCode: string
  date: string
}

export interface GetNextSessionsRequest extends BaseRequest {
  teamCode: string
  providerCode: string
}

export type SessionSummariesDto = {
  allocations: SessionSummaryDto[]
}

export interface GetAppointmentRequest extends BaseRequest {
  projectCode: string
  appointmentId: string
}

export interface AppointmentParams {
  appointmentId: string
  projectCode: string
}

export interface SaveAppointmentRequest extends BaseRequest {
  projectCode: string
  data: UpdateAppointmentOutcomeDto
}

export interface LinkItem {
  text: string
  href: string
}

export type AppointmentArrivedAction = 'arrived' | 'absent'

export type AppointmentCompletedAction = 'completed' | 'leftEarly'

export type AppointmentStatusType =
  | 'Scheduled'
  | 'Working'
  | 'Session complete'
  | 'Not expected'
  | 'Absent'
  | 'Cannot work'
  | 'Left site'

// Should be a known colour variation of the GOV.UK Design System Tag component: https://design-system.service.gov.uk/components/tag/
export type GovUkStatusTagColour = 'grey' | 'green' | 'blue' | 'pink' | 'red' | 'orange' | 'yellow' | 'purple'

export type ValidationErrors<T> = Partial<Record<keyof T, Record<'text', string>>>

export interface GovUkRadioOption {
  text: string
  value: string
  checked?: boolean
}

export type YesOrNo = 'yes' | 'no'
