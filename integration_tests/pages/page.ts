export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new (...args: Array<unknown>) => T, ...args: Array<unknown>): T {
    return new constructor(...args)
  }

  protected constructor(protected readonly title: string) {
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

  getInputByLabel(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .get('label')
      .contains(label)
      .invoke('attr', 'for')
      .then(id => this.getTextInputById(id))
  }

  getTextInputByIdAndEnterDetails(id: string, details: string): void {
    cy.get(`#${id}`).type(details)
  }

  getRadioByNameAndValue(name: string, option: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`input[name="${name}"][value="${option}"]`)
  }

  checkRadioByNameAndValue(name: string, option: string): void {
    this.getRadioByNameAndValue(name, option).check()
  }

  shouldHaveInputValue(label: string, value: string): void {
    this.getInputByLabel(label).should('have.value', value)
  }

  shouldShowErrorSummary(field: string, errorMessage: string) {
    cy.get(`[data-cy-error-${field}]`).should('contain', errorMessage)
  }
}
