import { AppointmentDto, ContactOutcomeDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { GovUkRadioOption, ValidationErrors } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import ReferenceDataService from '../../../services/referenceDataService'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
  items: GovUkRadioOption[]
  notes?: string
  isSensitive?: string
}

interface Query {
  unableToWork?: string
  notes?: string
  isSensitive?: string
}

interface Body {
  unableToWork: string
  notes?: string
  isSensitive?: string
}

export default class UnableToWorkPage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly formId: string,
    private readonly query: Query = {},
    private readonly inReview: boolean = false,
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    return paths.appointments.confirm.unableToWork({ projectCode, appointmentId })
  }

  protected backPath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.arrived.isAbleToWork({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  protected updatePath(appointment: AppointmentDto): string {
    let path
    if (this.inReview || this.hasErrors) {
      path = paths.appointments.review.unableToWork
    } else {
      path = paths.appointments.arrived.unableToWork
    }

    return path({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  viewData(appointment: AppointmentDto, contactOutcomes: ContactOutcomeDto[]): ViewData {
    const commonViewData = this.commonViewData(appointment)

    return {
      ...commonViewData,
      title: this.getPageTitle(commonViewData.offender),
      items: this.items(contactOutcomes, this.query.unableToWork),
      notes: this.query.notes,
      isSensitive: this.query.isSensitive,
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}
    if (!this.query.unableToWork) {
      errors.unableToWork = { text: 'Select the reason why the person is unable to work today' }
    }

    if (this.query.notes && this.query.notes.length > 4000) {
      errors.notes = { text: 'Notes must be 4000 characters or less' }
    }

    return errors
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    const body: UpdateAppointmentOutcomeDto = {
      ...this.appointmentRequestBody(appointment),
      contactOutcomeCode: this.query.unableToWork,
      notes: this.query.notes || null,
    }

    if (this.query.isSensitive) {
      body.sensitive = true
    }

    if (
      this.query.unableToWork === ReferenceDataService.attendedSentHomeServiceIssuesOutcomeCode ||
      this.query.unableToWork === ReferenceDataService.attendedFailedToComplyOutcomeCode
    ) {
      body.attendanceData = {
        hiVisWorn: false,
        workedIntensively: false,
        workQuality: 'NOT_APPLICABLE',
        behaviour: 'NOT_APPLICABLE',
      }
    }

    if (this.query.unableToWork === ReferenceDataService.attendedSentHomeBehaviourOutcomeCode) {
      body.attendanceData = {
        hiVisWorn: false,
        workedIntensively: false,
        workQuality: 'NOT_APPLICABLE',
        behaviour: 'UNSATISFACTORY',
      }
    }

    return body
  }

  private getPageTitle(offender: Offender): string {
    return `Why is ${offender.name} unable to work today?`
  }

  private items(
    contactOutcomes: ContactOutcomeDto[],
    unableToWork: string,
  ): { text: string; value: string; checked: boolean }[] {
    return contactOutcomes.map(outcome => ({
      text: outcome.name,
      value: outcome.code,
      checked: outcome.code === unableToWork,
    }))
  }
}
