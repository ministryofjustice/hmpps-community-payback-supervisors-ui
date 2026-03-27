import Page from '../../page'

export default class ReviewPage extends Page {
  constructor() {
    super('Check your answers')
  }

  shouldShowAlertPractitionerMessage() {
    cy.get('div')
      .contains('This outcome will be shared with the practitioner as it requires enforcement action.')
      .should('be.visible')
  }

  shouldNotShowAlertPractitionerMessage() {
    cy.get('div')
      .contains('This outcome will be shared with the practitioner as it requires enforcement action.')
      .should('not.exist')
  }
}
