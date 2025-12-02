import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { AppointmentCompletedAction, ValidationErrors } from '../../../@types/user-defined'
import InvalidUpdateActionError from '../../../errors/invalidUpdateActionError'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import DateTimeFormats from '../../../utils/dateTimeUtils'
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
    private readonly query: Query = {},
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    // TODO: this will be compliance page (with action type)
    return paths.appointments.confirm.completed({ projectCode, appointmentId })
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments.show({ projectCode: appointment.projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return paths.appointments[this.action].endTime({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    return {
      ...this.appointmentRequestBody(appointment),
      endTime: this.query.time,
    }
  }

  viewData(appointment: AppointmentDto): ViewData {
    const commonViewData = this.commonViewData(appointment)
    const hasFormBody = this.query.time !== undefined

    return {
      ...commonViewData,
      time: hasFormBody ? this.query.time : appointment.endTime,
      question: this.getPageTitle(commonViewData.offender),
      documentTitle: 'Log finish time',
    }
  }

  protected getValidationErrors(appointment: AppointmentDto): ValidationErrors<Body> {
    if (!this.query.time) {
      return { time: { text: 'Enter a finish time' } }
    }

    if (!DateTimeFormats.isValidTime(this.query.time as string)) {
      return { time: { text: 'Enter a valid finish time, for example 17:00' } }
    }

    if (DateTimeFormats.isBeforeTime(this.query.time, appointment.startTime)) {
      return {
        time: {
          text: `Finish time must be after ${appointment.startTime} when they started the session`,
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
