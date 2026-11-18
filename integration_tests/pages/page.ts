import { OffenderDto } from '../../server/@types/shared'
import Offender from '../../server/models/offender'

export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T extends Page>(constructor: new (...args: Array<unknown>) => T, ...args: Array<unknown>): T {
    const page = new constructor(...args)
    page.checkOnPage()
    return page
  }

  protected constructor(protected readonly title: string) {}

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
    this.shouldNotHavePopNameInDocumentTitle()
    this.customCheckOnPage()
  }

  shouldNotHavePopNameInDocumentTitle(): void {
    const containsWord = (text: string, word: string) =>
      new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)

    cy.task<Array<string>>('getStubbedPopNameParts').then(nameParts => {
      cy.title().then(title => {
        nameParts.forEach(namePart => {
          expect(containsWord(title, namePart), `document title "${title}" contains the name "${namePart}"`).to.equal(
            false,
          )
        })
      })
    })
  }

  // Ignoring rule `no-empty-function`
  // This is designed to be empty to provide an optional page verification override at the class implementation level
  protected customCheckOnPage(): void {} // eslint-disable-line no-empty-function

  clickContinue(text = 'Continue'): void {
    cy.get('button').contains(text).click()
  }

  clickConfirm(text = 'Confirm'): void {
    cy.get('button').contains(text).click()
  }

  clickBack = () => {
    cy.get('a').contains('Back').click()
  }

  signOut = (): PageElement => cy.get('[data-qa=signOut]')

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
    this.shouldHaveErrorPageTitle()
  }

  shouldHaveErrorPageTitle() {
    cy.title().should('match', /^Error: /)
  }

  shouldShowOffenderDetails(offender: OffenderDto): void {
    cy.get('.govuk-caption-l').should('contain.text', offender.crn)
    cy.get('h1').should('contain.text', new Offender(offender).name)
  }
}
