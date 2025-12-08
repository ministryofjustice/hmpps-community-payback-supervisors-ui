import { AppointmentDto } from '../../server/@types/shared'
import Offender from '../../server/models/offender'
import SummaryListComponent from './components/summaryListComponent'
import Page from './page'
import paths from '../../server/paths'
import { AppointmentStatusType } from '../../server/@types/user-defined'

export default class AppointmentPage extends Page {
  private readonly appointmentDetails: SummaryListComponent

  private readonly appointment: AppointmentDto

  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    super(offender.name)

    this.appointment = appointment
    this.appointmentDetails = new SummaryListComponent()
  }

  static visit(appointment: AppointmentDto): AppointmentPage {
    cy.visit(
      paths.appointments.show({ projectCode: appointment.projectCode, appointmentId: appointment.id.toString() }),
    )

    return new AppointmentPage(appointment)
  }

  arrivedButton() {
    return cy.get('a').contains('Arrived')
  }

  notArrivedButton() {
    return cy.get('a').contains('Not arrived')
  }

  finishedButton() {
    return cy.get('a').contains('Finish session')
  }

  shouldShowOffenderDetails(): void {
    cy.get('span').contains(this.appointment.offender.crn)
  }

  shouldShowStatus(status: AppointmentStatusType) {
    this.appointmentDetails.getValueWithLabel('Session status').should('contain.text', status)
  }

  shouldShowAppointmentDetails(): void {
    this.appointmentDetails.getValueWithLabel('Start time').should('contain.text', this.appointment.startTime)
    this.appointmentDetails.getValueWithLabel('Finish time').should('contain.text', this.appointment.endTime)
  }
}
