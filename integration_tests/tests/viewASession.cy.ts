//  Feature: View a project session
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to view a project session
//
//  Scenario: viewing a session page
//      Given I am logged in
//      When I visit a session page
//      Then I see the session details
//

import IndexPage from '../pages'
import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'

context('Home', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  //  Scenario: viewing the home page
  it('shows the find a session search form', () => {
    // Given I am logged in
    cy.signIn()
    const page = Page.verifyOnPage(IndexPage)

    //  When I visit a session page
    const session = sessionFactory.build()
    cy.task('stubFindSession', { session })
    page.clickViewSession()

    //  Then I see the search form
    const sessionPage = Page.verifyOnPage(SessionPage, session)
    sessionPage.shouldShowSessionDetails()
  })
})
