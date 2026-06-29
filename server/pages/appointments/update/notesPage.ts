import {
  AppointmentNotesAction,
  AppointmentOutcomeForm,
  AppointmentUpdateQuery,
  ValidationErrors,
  YesOrNo,
} from '../../../@types/user-defined'
import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import paths from '../../../paths'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'
import { pathWithQuery } from '../../../utils/utils'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import ReferenceDataService from '../../../services/referenceDataService'
import { ReviewQuery } from './reviewPage'

export type AttendanceOutcomeBody = {
  attendanceOutcome: string
  notes?: string
}

export type NotesQuery = {
  notes?: string
  isSensitive?: string
} & ReviewQuery &
  AppointmentUpdateQuery

type ViewData = {
  notes?: string
  isSensitive: boolean
  showIsSensitiveQuestion: boolean
} & AppointmentUpdatePageViewData

interface Body {
  notes: string
  isSensitive?: string
}

export default class NotesPage extends BaseAppointmentUpdatePage<Body> {
  private query: NotesQuery

  private appointment: AppointmentDto

  private action: AppointmentNotesAction

  formId: string | undefined

  constructor({
    action,
    query,
    appointment,
  }: {
    action: AppointmentNotesAction
    query: NotesQuery
    appointment: AppointmentDto
  }) {
    super()
    this.action = action
    this.query = query
    this.appointment = appointment

    this.formId = query.form?.toString()
  }

  updateForm(form: AppointmentOutcomeForm): AppointmentOutcomeForm {
    return {
      ...form,
      notes: this.query.notes,
      sensitive: this.appointment.sensitive === true || this.query.isSensitive === 'true',
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}

    if (this.query.notes && this.query.notes.length > 4000) {
      errors.notes = { text: 'Notes must be 4000 characters or less' }
    }

    return errors
  }

  viewData(form: AppointmentOutcomeForm): ViewData {
    return {
      ...this.commonViewData(this.appointment),
      form: this.formId,
      notes: this.query.notes || form.notes,
      isSensitive: this.query.isSensitive === 'true' || form.sensitive,
      showIsSensitiveQuestion: this.appointment.sensitive !== true,
    }
  }

  buildPayload(appointment: AppointmentDto, formData: AppointmentOutcomeForm): UpdateAppointmentOutcomeDto {
    let payload: UpdateAppointmentOutcomeDto

    if (this.action === 'absent') {
      payload = {
        deliusId: appointment.id,
        deliusVersionToUpdate: appointment.version,
        alertActive: GovUkRadioGroup.nullableValueFromYesOrNoItem(this.query.alertPractitioner as YesOrNo),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        contactOutcomeCode: ReferenceDataService.UnacceptableAbsenceOutcomeCode,
        attendanceData: appointment.attendanceData,
        enforcementData: appointment.enforcementData,
        supervisorOfficerCode: appointment.supervisorOfficerCode,
        notes: formData.notes,
        sensitive: formData.sensitive,
        date: appointment.date,
      }
    } else {
      payload = {
        deliusId: appointment.id,
        deliusVersionToUpdate: formData.deliusVersion,
        startTime: formData.startTime,
        endTime: formData.endTime,
        contactOutcomeCode: formData.contactOutcomeCode,
        attendanceData: {
          ...appointment.attendanceData,
          ...formData.attendanceData,
        },
        enforcementData: appointment.enforcementData,
        supervisorOfficerCode: appointment.supervisorOfficerCode,
        alertActive: GovUkRadioGroup.nullableValueFromYesOrNoItem(this.query.alertPractitioner as YesOrNo),
        notes: formData.notes,
        sensitive: formData.sensitive,
        date: appointment.date,
      }
    }

    return payload
  }

  protected backPath(): string {
    if (this.action === 'absent') {
      return paths.appointments.show({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      })
    }
    return this.pathWithFormId(
      paths.appointments.completed.compliance({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
    )
  }

  nextPath(projectCode: string, appointmentId: string): string {
    return paths.appointments.confirm[this.action]({ projectCode, appointmentId })
  }

  updatePath(): string {
    return this.pathWithFormId(
      paths.appointments.review[this.action]({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
    )
  }

  protected pathWithFormId(path: string): string {
    return pathWithQuery(path, { form: this.formId })
  }
}
