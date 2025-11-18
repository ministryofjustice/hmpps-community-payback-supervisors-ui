import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
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
  constructor(private readonly query: Query = {}) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string, action: string): string {
    return paths.appointments.ableToWork({ projectCode, appointmentId, action })
  }

  protected backPath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.show({ projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto, projectCode: string, action: string): string {
    return paths.appointments.startTime({ projectCode, appointmentId: appointment.id.toString(), action })
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    return {
      ...this.appointmentRequestBody(appointment),
      startTime: this.query.startTime,
    }
  }

  viewData(appointment: AppointmentDto, projectCode: string, action: string): ViewData {
    const commonViewData = this.commonViewData(appointment, projectCode, action)
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
    return `You are logging ${offender.name} as having arrived at:`
  }
}
