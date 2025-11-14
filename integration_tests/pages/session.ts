import { SessionDto } from '../../server/@types/shared'
import Page from './page'
import DateTimeFormats from '../../server/utils/dateTimeUtils'

export default class SessionPage extends Page {
  constructor(private readonly session: SessionDto) {
    super('Session details')
  }

  shouldShowSessionDetails() {
    cy.get('[data-cy=project-details')
      .should('contain.text', this.session.projectName)
      .and('contain.text', DateTimeFormats.isoDateToUIDate(this.session.date, { format: 'medium' }))

    const appointmentCount = this.session.appointmentSummaries.length
    cy.get('h2').should('contain.text', `${appointmentCount} people scheduled on this session`)
  }
}
