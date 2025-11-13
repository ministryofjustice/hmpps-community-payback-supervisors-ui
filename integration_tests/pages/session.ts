import { SessionDto } from '../../server/@types/shared'
import Page from './page'

export default class SessionPage extends Page {
  constructor(private readonly session: SessionDto) {
    super('Session details')
  }

  shouldShowSessionDetails() {
    cy.get('p').should('have.text', this.session.projectName)
  }
}
