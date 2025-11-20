import Page from '../../../page'

export default abstract class BaseConfirmPage extends Page {
  constructor(title: string) {
    super(title)
  }

  clickLinkToSessionPage(): void {
    cy.get('a').contains('Return to session page').click()
  }
}
