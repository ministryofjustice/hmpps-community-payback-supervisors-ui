export default class SummaryListComponent {
  constructor(private readonly title?: string) {}

  getValueWithLabel(label: string) {
    return this.component.get('dt').contains(label).find('+dd')
  }

  private get component() {
    return this.title ? cy.get('.govuk-summary-card').filter(`:contains(${this.title})`) : cy.get('dl')
  }
}
