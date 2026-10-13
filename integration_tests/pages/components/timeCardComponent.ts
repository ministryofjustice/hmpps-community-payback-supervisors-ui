export default class TimeCardComponent {
  constructor(private readonly title?: string) {}

  exists() {
    return this.component.should('exist')
  }

  notExist() {
    return this.component.should('not.exist')
  }

  private get component() {
    return cy.get('.govuk-summary-card').filter(`:contains(${this.title})`)
  }
}
