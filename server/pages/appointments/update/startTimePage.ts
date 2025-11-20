import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { AppointmentArrivedAction } from '../../../@types/user-defined'
import InvalidUpdateActionError from '../../../errors/invalidUpdateActionError'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import DateTimeFormats from '../../../utils/dateTimeUtils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  startTime: string
  title: string
}

interface Query {
  startTime?: string
}

interface Body {
  startTime: string
}

export default class StartTimePage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly action: AppointmentArrivedAction,
    private readonly query: Query = {},
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    if (this.action === 'arrived') {
      return paths.appointments.arrived.ableToWork({ projectCode, appointmentId })
    }

    if (this.action === 'absent') {
      // TODO: replace with confirm page once added
      return paths.appointments.absent.startTime({ projectCode, appointmentId })
    }

    throw new InvalidUpdateActionError(`Invalid update appointment action: ${this.action}`)
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments.show({ projectCode: appointment.projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return paths.appointments[this.action].startTime({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    return {
      ...this.appointmentRequestBody(appointment),
      startTime: this.query.startTime,
    }
  }

  viewData(appointment: AppointmentDto): ViewData {
    const commonViewData = this.commonViewData(appointment)
    const hasFormBody = this.query.startTime !== undefined

    return {
      ...commonViewData,
      startTime: hasFormBody ? this.query.startTime : appointment.startTime,
      title: this.getPageTitle(commonViewData.offender),
    }
  }

  validate(): void {
    if (!this.query.startTime) {
      this.validationErrors.startTime = { text: 'Enter a start time' }
    } else if (!DateTimeFormats.isValidTime(this.query.startTime as string)) {
      this.validationErrors.startTime = { text: 'Enter a valid start time, for example 09:00' }
    }

    this.checkHasErrors()
  }

  private getPageTitle(offender: Offender): string {
    if (this.action === 'arrived') {
      return `You are logging ${offender.name} as having arrived at:`
    }

    if (this.action === 'absent') {
      return `You are logging ${offender.name} as absent:`
    }

    throw new InvalidUpdateActionError(`Invalid update appointment action: ${this.action}`)
  }
}
