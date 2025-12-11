import { SessionSummaryDto } from '../../server/@types/shared'
import DateTimeFormats from '../../server/utils/dateTimeUtils'
import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor(private readonly sessionSummary: SessionSummaryDto) {
    super('Next session')
    this.sessionSummary = sessionSummary
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  clickViewSession = () => cy.get('a').contains('View details').click()

  shouldShowSessionSummaryDetails() {
    cy.get('[data-cy=session-details]')
      .first()
      .within(() => {
        cy.get('h2').should(
          'contain.text',
          DateTimeFormats.isoDateToUIDate(this.sessionSummary.date, { format: 'medium' }),
        )
        cy.get('h3').should('contain.text', this.sessionSummary.projectName)
        cy.get('p').should('contain.text', this.sessionSummary.numberOfOffendersAllocated)
        cy.get('p').should('contain.text', 'person')
      })

    cy.get('[data-cy=session-details]')
      .last()
      .within(() => {
        cy.get('p').should('contain.text', 'people')
      })
  }
}
