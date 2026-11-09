import { SessionSummaryDto } from '../../server/@types/shared'
import DateTimeFormats from '../../server/utils/dateTimeUtils'
import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor(private readonly sessionSummaries: SessionSummaryDto[]) {
    super('Find a group session')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerEnvironmentBanner = (): PageElement => cy.get('[data-qa=header-environment-banner]')

  headerPhaseBanner = (): PageElement => cy.get('.govuk-phase-banner')

  clickViewSession = () => cy.get('a').contains('View').click()

  shouldShowSessionSummaryDetails() {
    this.sessionSummaries.forEach((sessionSummary, i) => {
      cy.get('[data-cy=session-details]')
        .eq(i)
        .within(() => {
          cy.get('h2').should(
            'contain.text',
            DateTimeFormats.isoDateToUIDate(sessionSummary.date, { format: 'medium' }),
          )
          cy.get('h3').should('contain.text', sessionSummary.projectName)
          cy.get('p').should('contain.text', sessionSummary.numberOfOffendersAllocated)
        })
    })
  }

  shouldContainPersonTextForSession(i: number) {
    cy.get('[data-cy=session-details]')
      .eq(i)
      .within(() => {
        cy.get('p').should('contain.text', 'person')
      })
  }

  shouldContainPeopleTextForSession(i: number) {
    cy.get('[data-cy=session-details]')
      .eq(i)
      .within(() => {
        cy.get('p').should('contain.text', 'people')
      })
  }
}
