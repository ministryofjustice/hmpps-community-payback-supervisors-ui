import Page, { PageElement } from './page'

export default class AuthErrorPage extends Page {
  constructor() {
    super('Authorisation Error')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')
}
