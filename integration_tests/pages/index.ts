import { ProviderSummaryDto, ProviderTeamSummaryDto, SessionSummaryDto } from '../../server/@types/shared'
import DateTimeFormats from '../../server/utils/dateTimeUtils'
import Page, { PageElement } from './page'
import SelectInput from './components/selectComponent'

export default class IndexPage extends Page {
  regionSelect = new SelectInput('provider')

  teamSelect = new SelectInput('team')

  constructor(private readonly sessionSummaries: SessionSummaryDto[]) {
    super('Find a group session')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerEnvironmentBanner = (): PageElement => cy.get('[data-qa=header-environment-banner]')

  headerPhaseBanner = (): PageElement => cy.get('.govuk-phase-banner')

  clickViewSession = () => cy.get('a').contains('View').click()

  shouldShowSearchForm() {
    cy.get('h2').contains('Filter sessions')
    cy.get('label').contains('Region')
    cy.get('label').contains('Project team')
    cy.get('label').contains('Date')
  }

  enterDate() {
    cy.get('#date').type('18/9/2025')
  }

  selectRegion(provider: ProviderSummaryDto) {
    this.regionSelect.select(provider.code)
  }

  selectTeam(team: ProviderTeamSummaryDto) {
    this.teamSelect.select(team.code)
  }

  submitForm() {
    cy.get('button').contains('Apply filters').click()
  }

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
