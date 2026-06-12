import {
  AppointmentOutcomeForm,
  AppointmentUpdatePageViewData,
  AppointmentUpdateQuery,
  GovUkRadioOption,
  ValidationErrors,
} from '../../../@types/user-defined'
import { AppointmentDto, ContactOutcomeDto } from '../../../@types/shared'
import paths from '../../../paths'
import BaseAppointmentUpdatePage from './baseAppointmentUpdatePage'
import { pathWithQuery } from '../../../utils/utils'
import ReferenceDataService from '../../../services/referenceDataService'

export type AttendanceOutcomeBody = {
  attendanceOutcome: string
  notes?: string
}

type AttendanceOutcomeQuery = {
  attendanceOutcome?: string
} & AppointmentUpdateQuery

type ViewData = {
  items: Array<GovUkRadioOption>
} & AppointmentUpdatePageViewData

interface Body {
  attendanceOutcome: string
}

export default class AttendanceOutcomePage extends BaseAppointmentUpdatePage<Body> {
  private query: AttendanceOutcomeQuery

  private appointment: AppointmentDto

  private contactOutcomes: ContactOutcomeDto[]

  formId: string | undefined

  constructor({
    query,
    appointment,
    contactOutcomes,
  }: {
    query: AttendanceOutcomeQuery
    appointment: AppointmentDto
    contactOutcomes: ContactOutcomeDto[]
  }) {
    super()
    this.query = query
    this.appointment = appointment
    this.contactOutcomes = contactOutcomes.filter(outcome =>
      ReferenceDataService.attendedOutcomeCodes.includes(outcome.code),
    )

    this.formId = query.form?.toString()
  }

  updateForm(form: AppointmentOutcomeForm): AppointmentOutcomeForm {
    return {
      ...form,
      contactOutcomeCode: this.query.attendanceOutcome,
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}

    if (!this.query.attendanceOutcome) {
      errors.attendanceOutcome = { text: 'Select an attendance outcome' }
    }

    return errors
  }

  viewData(form: AppointmentOutcomeForm, hasErrors: boolean = false): ViewData {
    return {
      ...this.commonViewData(this.appointment),
      form: this.formId,
      items: this.items(form, hasErrors),
    }
  }

  protected backPath(): string {
    return paths.appointments.show({
      projectCode: this.appointment.projectCode,
      appointmentId: this.appointment.id.toString(),
    })
  }

  nextPath(projectCode: string, appointmentId: string): string {
    return this.pathWithFormId(
      paths.appointments.arrived.startTime({
        projectCode,
        appointmentId,
      }),
    )
  }

  updatePath(): string {
    return this.pathWithFormId(
      paths.appointments.attendanceOutcome({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
    )
  }

  private items(form: AppointmentOutcomeForm, hasErrors: boolean): { text: string; value: string }[] {
    const code = hasErrors ? this.query.attendanceOutcome : form.contactOutcomeCode
    return this.contactOutcomes.map(outcome => ({
      text: outcome.name,
      value: outcome.code,
      checked: outcome.code === code,
    }))
  }

  protected pathWithFormId(path: string): string {
    return pathWithQuery(path, { form: this.formId })
  }
}
