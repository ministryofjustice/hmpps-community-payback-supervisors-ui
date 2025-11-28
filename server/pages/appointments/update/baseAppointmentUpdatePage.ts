import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { ValidationErrors } from '../../../@types/user-defined'
import Offender from '../../../models/offender'

export interface AppointmentUpdatePageViewData {
  backPath: string
  offender: Offender
  updatePath: string
  form?: string
}

export default abstract class BaseAppointmentUpdatePage<TBody> {
  validationErrors: ValidationErrors<TBody> = {}

  hasErrors: boolean

  validate(...args: Array<unknown>) {
    this.validationErrors = this.getValidationErrors(...args) ?? {}

    this.checkHasErrors()
  }

  abstract nextPath(appointmentId: string | AppointmentDto, projectCode: string): string

  protected abstract backPath(appointment: AppointmentDto): string

  protected abstract updatePath(appointment: AppointmentDto): string

  protected abstract getValidationErrors(...args: Array<unknown>): ValidationErrors<TBody> | undefined

  protected appointmentRequestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    return {
      deliusId: appointment.id,
      deliusVersionToUpdate: appointment.version,
      alertActive: appointment.alertActive,
      sensitive: appointment.sensitive,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      contactOutcomeCode: appointment.contactOutcomeCode,
      attendanceData: appointment.attendanceData,
      enforcementData: appointment.enforcementData,
      notes: null,
      supervisorOfficerCode: appointment.supervisorOfficerCode,
    }
  }

  protected commonViewData(appointment: AppointmentDto): AppointmentUpdatePageViewData {
    return {
      offender: new Offender(appointment.offender),
      backPath: this.backPath(appointment),
      updatePath: this.updatePath(appointment),
    }
  }

  protected checkHasErrors(): void {
    this.hasErrors = Object.keys(this.validationErrors).length > 0
  }
}
