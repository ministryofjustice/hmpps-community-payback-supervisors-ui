import { AppointmentDto } from '../../server/@types/shared'
import Offender from '../../server/models/offender'
import SummaryListComponent from './components/summaryListComponent'
import Page from './page'
import paths from '../../server/paths'

export default class AppointmentPage extends Page {
  private readonly sessionDetails: SummaryListComponent

  private readonly pickUpDetails: SummaryListComponent

  private readonly appointment: AppointmentDto

  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    super(offender.name)

    this.appointment = appointment
    this.sessionDetails = new SummaryListComponent('Session details')
    this.pickUpDetails = new SummaryListComponent('Pick-up details')
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

  clickLeftSiteEarly() {
    cy.get('a').contains('Left site early').click()
  }

  shouldShowOffenderDetails(): void {
    cy.get('span').contains(this.appointment.offender.crn)
  }

  shouldShowStatus(status: string) {
    this.sessionDetails.getValueWithLabel('Session status').should('contain.text', status)
  }

  shouldShowAppointmentDetails(): void {
    this.sessionDetails.getValueWithLabel('Start time').should('contain.text', this.appointment.startTime)
    this.sessionDetails.getValueWithLabel('Finish time').should('contain.text', this.appointment.endTime)
  }

  shouldShowPickUpDetails(): void {
    this.pickUpDetails
      .getValueWithLabel('Location')
      .should('contain.text', this.appointment.pickUpData?.pickupLocation?.buildingName)
    this.pickUpDetails.getValueWithLabel('Time').should('contain.text', this.appointment.pickUpData?.time)
  }

  shouldNotHaveAnyActions() {
    this.arrivedButton().should('not.exist')
    this.notArrivedButton().should('not.exist')
    this.finishedButton().should('not.exist')
  }
}
