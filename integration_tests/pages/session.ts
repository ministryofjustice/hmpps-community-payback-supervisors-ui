import { OffenderFullDto, SessionDto } from '../../server/@types/shared'
import Page from './page'
import DateTimeFormats from '../../server/utils/dateTimeUtils'
import paths from '../../server/paths'
import { AppointmentStatusType } from '../../server/@types/user-defined'

export default class SessionPage extends Page {
  offenders: OffenderFullDto[]

  constructor(private readonly session: SessionDto) {
    super('Session details')
    this.offenders = session.appointmentSummaries.map(appointment => appointment.offender as OffenderFullDto)
  }

  static visit(session: SessionDto): SessionPage {
    cy.visit(paths.sessions.show({ projectCode: session.projectCode, date: session.date }))

    return new SessionPage(session)
  }

  clickOnAnAppointment() {
    cy.get('a').contains('View and update').click()
  }

  shouldShowSessionDetails() {
    cy.get('[data-cy=project-details]')
      .first()
      .should('contain.text', this.session.projectName)
      .and('contain.text', DateTimeFormats.isoDateToUIDate(this.session.date, { format: 'medium' }))

    const appointmentCount = this.session.appointmentSummaries.length
    cy.get('h2').should('contain.text', `${appointmentCount} people scheduled on this session`)
  }

  shouldShowAppointmentsForEachOffender() {
    this.offenders.forEach(offender => {
      cy.get('li').should('contain.text', `${offender.forename} ${offender.surname}`)
    })
  }

  shouldShowAppointmentsWithScheduledStatus() {
    this.offenders.forEach(offender => {
      cy.contains('li', `${offender.forename} ${offender.surname}`).should('contain.text', 'Scheduled')
    })
  }

  shouldShowAppointmentsWithStatuses(appointmentStatuses: AppointmentStatusType[]) {
    this.offenders.forEach((offender, i) => {
      cy.contains('li', `${offender.forename} ${offender.surname}`).should('contain.text', appointmentStatuses[i])
    })
  }
}
