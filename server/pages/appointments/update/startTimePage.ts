import { AppointmentDto } from '../../../@types/shared'
import { AppointmentArrivedAction, AppointmentOutcomeForm, ValidationErrors } from '../../../@types/user-defined'
import InvalidUpdateActionError from '../../../errors/invalidUpdateActionError'
import Offender from '../../../models/offender'
import paths from '../../../paths'
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

export default class StartTimePage extends BaseAppointmentUpdatePage<Body> {
  static UnacceptableAbsenceOutcomeCode = 'UAAB'

  constructor(
    private readonly action: AppointmentArrivedAction,
    private formId: string,
    private readonly query: Query = {},
    private readonly inReview: boolean = false,
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    if (this.action === 'arrived') {
      return pathWithQuery(paths.appointments.arrived.isAbleToWork({ projectCode, appointmentId }), {
        form: this.formId,
      })
    }

    if (this.action === 'absent') {
      return pathWithQuery(paths.appointments.confirm.absent({ projectCode, appointmentId }), { form: this.formId })
    }

    throw new InvalidUpdateActionError(`Invalid update appointment action: ${this.action}`)
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments.show({ projectCode: appointment.projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto): string {
    let path
    if (this.action === 'absent' && this.inReview) {
      path = paths.appointments.review.absent
    } else {
      path = paths.appointments[this.action].startTime
    }

    return pathWithQuery(
      path({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  updatedFormData(formData: AppointmentOutcomeForm): AppointmentOutcomeForm {
    const updated = {
      ...formData,
      startTime: this.query.time,
    }

    if (this.action === 'absent') {
      updated.contactOutcomeCode = StartTimePage.UnacceptableAbsenceOutcomeCode
    }

    return updated
  }

  viewData(appointment: AppointmentDto, formData: AppointmentOutcomeForm): ViewData {
    const commonViewData = this.commonViewData(appointment)
    const hasFormBody = this.query.time !== undefined

    return {
      ...commonViewData,
      time: hasFormBody ? this.query.time : formData.startTime,
      question: this.getPageTitle(commonViewData.offender),
      documentTitle: 'Log start time',
    }
  }

  protected getValidationErrors(appointment: AppointmentDto): ValidationErrors<Body> | undefined {
    if (!this.query.time) {
      return { time: { text: 'Enter a start time' } }
    }

    if (!DateTimeFormats.isValidTime(this.query.time as string)) {
      return { time: { text: 'Enter a valid start time, for example 09:00' } }
    }

    if (DateTimeFormats.isAfterTime(this.query.time, appointment.endTime)) {
      return {
        time: {
          text: `Start time must be before ${appointment.endTime} when they are expected to finish the session`,
        },
      }
    }

    return {}
  }

  private getPageTitle(offender: Offender): string {
    if (this.action === 'arrived') {
      return `You're logging ${offender.name} as having arrived at:`
    }

    if (this.action === 'absent') {
      return `You're logging ${offender.name} as absent today at:`
    }

    throw new InvalidUpdateActionError(`Invalid update appointment action: ${this.action}`)
  }
}
