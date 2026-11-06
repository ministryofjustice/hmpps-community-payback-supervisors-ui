import Page, { PageElement } from './page'

export default class AuthErrorPage extends Page {
  constructor() {
    super('Authorisation error')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')
}
