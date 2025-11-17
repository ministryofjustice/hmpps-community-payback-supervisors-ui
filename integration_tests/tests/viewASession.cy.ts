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
//  Scenario: viewing an individual appointment
//    Given I am on a session page
//    When I click on an appointment
//    Then I am taken to the appointment page

import IndexPage from '../pages'
import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'
import appointmentSummaryFactory from '../../server/testutils/factories/appointmentSummaryFactory'
import AppointmentPage from '../pages/appointment'
import appointmentFactory from '../../server/testutils/factories/appointmentFactory'

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
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries, projectCode: 'N56123456', date: '2025-09-22' })
    cy.task('stubFindSession', { session })
    page.clickViewSession()

    //  Then I see the search form
    const sessionPage = Page.verifyOnPage(SessionPage, session)
    sessionPage.shouldShowSessionDetails()
  })
})

context('Session', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  //  Scenario: viewing an individual appointment
  it('Viewing a person on a session', () => {
    // Given I am on a session page
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    cy.task('stubFindSession', { session })
    const sessionPage = SessionPage.visit(session)

    const appointment = appointmentFactory.build({ id: appointmentSummaries[0].id })
    //  When I click on an appointment
    cy.task('stubFindAppointment', { appointment, projectCode: session.projectCode })
    sessionPage.clickOnAnAppointment()
    //  Then I am taken to the appointment page
    Page.verifyOnPage(AppointmentPage, appointment)
  })
})
