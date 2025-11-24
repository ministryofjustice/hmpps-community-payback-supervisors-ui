import { AppointmentDto, ContactOutcomeDto } from '../../../@types/shared'
import { GovUkRadioOption } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
  items: GovUkRadioOption[]
}

interface Query {
  unableToWork?: string
}

interface Body {
  unableToWork: string
}

export default class UnableToWorkPage extends BaseAppointmentUpdatePage<Body> {
  constructor(private readonly query: Query = {}) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    return paths.appointments.confirm.unableToWork({ projectCode, appointmentId })
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments.arrived.ableToWork({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return paths.appointments.arrived.unableToWork({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  viewData(appointment: AppointmentDto, contactOutcomes: ContactOutcomeDto[]): ViewData {
    const commonViewData = this.commonViewData(appointment)

    return {
      ...commonViewData,
      title: this.getPageTitle(commonViewData.offender),
      items: this.items(contactOutcomes),
    }
  }

  validate(): void {
    if (!this.query.unableToWork) {
      this.validationErrors.unableToWork = { text: 'Select the reason why the person is unable to work today' }
    }

    this.checkHasErrors()
  }

  private getPageTitle(offender: Offender): string {
    return `Why is ${offender.name} unable to work today?`
  }

  private items(contactOutcomes: ContactOutcomeDto[]): { text: string; value: string }[] {
    return contactOutcomes.map(outcome => ({
      text: outcome.name,
      value: outcome.code,
    }))
  }
}
