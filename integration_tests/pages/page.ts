export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new (...args: Array<unknown>) => T, ...args: Array<unknown>): T {
    return new constructor(...args)
  }

  protected constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  clickSubmit(text = 'continue'): void {
    cy.get('button').contains(text).click()
  }

  clickBack = () => {
    cy.get('a').contains('Back').click()
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  getTextInputById(id: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`#${id}`)
  }

  getTextInputByIdAndEnterDetails(id: string, details: string): void {
    cy.get(`#${id}`).type(details)
  }

  checkRadioByNameAndValue(name: string, option: string): void {
    cy.get(`input[name="${name}"][value="${option}"]`).check()
  }

  shouldHaveInputValue(id: string, value: string): void {
    this.getTextInputById(id).should('have.value', value)
  }

  shouldShowErrorSummary(field: string, errorMessage: string) {
    cy.get(`[data-cy-error-${field}]`).should('contain', errorMessage)
  }
}
