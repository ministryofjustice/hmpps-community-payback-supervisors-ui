import { OffenderFullDto, SessionDto } from '../../server/@types/shared'
import Page from './page'
import DateTimeFormats from '../../server/utils/dateTimeUtils'

export default class SessionPage extends Page {
  offenders: OffenderFullDto[]

  constructor(private readonly session: SessionDto) {
    super('Session details')
    this.offenders = session.appointmentSummaries.map(appointment => appointment.offender as OffenderFullDto)
  }

  shouldShowSessionDetails() {
    cy.get('[data-cy=project-details')
      .should('contain.text', this.session.projectName)
      .and('contain.text', DateTimeFormats.isoDateToUIDate(this.session.date, { format: 'medium' }))

    const appointmentCount = this.session.appointmentSummaries.length
    cy.get('h2').should('contain.text', `${appointmentCount} people scheduled on this session`)

    this.offenders.forEach(offender => {
      cy.get('li').should('contain.text', `${offender.forename} ${offender.surname}`)
    })
  }
}
