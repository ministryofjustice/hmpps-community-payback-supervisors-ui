/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto'
import type { EnforcementDto } from './EnforcementDto'
import type { FormKeyDto } from './FormKeyDto'
export type UpdateAppointmentOutcomeDto = {
  /**
   * The start local time of the appointment
   */
  startTime: string
  /**
   * The end local time of the appointment
   */
  endTime: string
  contactOutcomeId: string
  supervisorOfficerCode: string
  notes?: string
  attendanceData?: AttendanceDataDto
  enforcementData?: EnforcementDto
  /**
   * If provided, the corresponding form data will be deleted
   */
  formKeyToDelete?: FormKeyDto
}
