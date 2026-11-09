export default class SelectInput {
  constructor(private readonly name: string) {}

  select(value: string) {
    cy.get(`#${this.name}`).select(`${value}`)
  }

  shouldHaveValue(value: string) {
    cy.get(`select#${this.name} option:selected`).should('have.value', value)
  }

  shouldNotHaveAValue() {
    cy.get(`select#${this.name} option:selected`).should('have.value', '')
  }
}
