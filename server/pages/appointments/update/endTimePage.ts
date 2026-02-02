import { AppointmentDto } from '../../../@types/shared'
import { AppointmentCompletedAction, AppointmentOutcomeForm, ValidationErrors } from '../../../@types/user-defined'
import InvalidUpdateActionError from '../../../errors/invalidUpdateActionError'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import ReferenceDataService from '../../../services/referenceDataService'
import DateTimeFormats from '../../../utils/dateTimeUtils'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  time: string
  question: string
  documentTitle: string
}

interface Query {
  time?: string
}

interface Body {
  time: string
}

export default class EndTimePage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly action: AppointmentCompletedAction,
    private formId: string,
    private readonly query: Query = {},
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    if (this.action === 'leftEarly') {
      return pathWithQuery(paths.appointments.leftEarly.reason({ projectCode, appointmentId }), { form: this.formId })
    }

    return pathWithQuery(
      paths.appointments.completed.compliance({
        projectCode,
        appointmentId,
        contactOutcomeCode: ReferenceDataService.attendedCompliedOutcomeCode,
      }),
      { form: this.formId },
    )
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments.show({ projectCode: appointment.projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments[this.action].endTime({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  updatedFormData(formData: AppointmentOutcomeForm): AppointmentOutcomeForm {
    return {
      ...formData,
      endTime: this.query.time,
    }
  }

  viewData(appointment: AppointmentDto, formData: AppointmentOutcomeForm): ViewData {
    const commonViewData = this.commonViewData(appointment)
    const hasFormBody = this.query.time !== undefined

    return {
      ...commonViewData,
      time: hasFormBody ? this.query.time : formData.endTime,
      question: this.getPageTitle(commonViewData.offender),
      documentTitle: 'Log finish time',
    }
  }

  protected getValidationErrors(appointment: AppointmentDto): ValidationErrors<Body> {
    if (!this.query.time) {
      return { time: { text: 'Enter the time they left' } }
    }

    if (!DateTimeFormats.isValidTime(this.query.time as string)) {
      return { time: { text: 'Enter a valid finish time, for example 17:00' } }
    }

    if (!DateTimeFormats.isAfterTime(this.query.time, appointment.startTime)) {
      return {
        time: {
          text: `Finish time must be after ${DateTimeFormats.stripTime(appointment.startTime)}`,
        },
      }
    }

    return {}
  }

  private getPageTitle(offender: Offender): string {
    if (this.action === 'completed') {
      return `You're logging ${offender.name} as finishing today at:`
    }

    if (this.action === 'leftEarly') {
      return `You're logging out ${offender.name} early today at:`
    }

    throw new InvalidUpdateActionError(`Invalid update appointment action: ${this.action}`)
  }
}
