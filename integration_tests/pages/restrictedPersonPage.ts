import Page from './page'

export default class RestrictedPersonPage extends Page {
  constructor(crn: string) {
    super(crn)
  }

  protected customCheckOnPage(): void {
    cy.get('.moj-alert__content').contains('The person is restricted and not eligible for this service.')
  }

  clickFindAnotherPerson = () => {
    cy.get('a').contains('Find another person').click()
  }
}
