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
//
//  Scenario: Viewing statuses
//    Scenario: viewing a new session with no appointment statuses saved
//      Given I am on a session page for a new session
//      Then I see scheduled statuses for each offender
//    Scenario: viewing a session's existing appointment statuses
//      Given I am on a session page for an in progress session
//      Then I see saved statuses for each offender
//    Scenario: viewing an in progress session with new appointments
//      Given I am on a session page for an in progress session
//      Then I see saved statuses for each offender and statuses for new appointments

import IndexPage from '../pages'
import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'
import appointmentSummaryFactory from '../../server/testutils/factories/appointmentSummaryFactory'
import AppointmentPage from '../pages/appointment'
import appointmentFactory from '../../server/testutils/factories/appointmentFactory'
import sessionSummaryFactory from '../../server/testutils/factories/sessionSummaryFactory'
import appointmentStatusFactory from '../../server/testutils/factories/appointmentStatusFactory'

context('Home', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  //  Scenario: viewing the home page
  it('shows the find a session search form', () => {
    const sessionSummary = sessionSummaryFactory.build({ date: '2025-09-15', projectCode: 'N56123456' })
    cy.task('stubNextSessions', { sessionSummary })

    // Given I am logged in
    cy.signIn()

    const page = Page.verifyOnPage(IndexPage, sessionSummary)
    page.shouldShowSessionSummaryDetails()

    //  When I visit a session page
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries, projectCode: 'N56123456', date: '2025-09-15' })
    cy.task('stubFindSession', { session })
    cy.task('stubGetFormNotFound', { session })
    page.clickViewSession()

    //  Then I see the session details
    const sessionPage = Page.verifyOnPage(SessionPage, session)
    sessionPage.shouldShowSessionDetails()
    sessionPage.shouldShowAppointmentsForEachOffender()
  })
})

context('Session', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    const sessionSummary = sessionSummaryFactory.build({ date: '2025-09-15' })
    cy.task('stubNextSessions', { sessionSummary })

    cy.signIn()
  })

  //  Scenario: viewing an individual appointment
  it('Viewing a person on a session', () => {
    // Given I am on a session page
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    cy.task('stubFindSession', { session })
    cy.task('stubGetFormNotFound', { session })
    const sessionPage = SessionPage.visit(session)

    const appointment = appointmentFactory.build({ id: appointmentSummaries[0].id, projectCode: session.projectCode })
    const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id })
    //  When I click on an appointment
    cy.task('stubFindAppointment', { appointment })
    cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })

    sessionPage.clickOnAnAppointment()
    //  Then I am taken to the appointment page
    Page.verifyOnPage(AppointmentPage, appointment)
  })

  // Scenario: Viewing statuses
  describe('statuses', () => {
    //  Scenario: viewing a new session with no appointment statuses saved
    it('Viewing a person on a session', () => {
      // Given I am on a session page for a new session
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      cy.task('stubFindSession', { session })
      cy.task('stubGetFormNotFound', { session })
      const sessionPage = SessionPage.visit(session)

      // Then I see scheduled statuses for each offender
      sessionPage.shouldShowAppointmentsWithScheduledStatus()
    })

    //  Scenario: viewing a session's existing appointment statuses
    it('shows existing statuses if they exist', () => {
      // Given I am on a session page for an in progress session
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const appointmentStatuses = appointmentSummaries.map(appointment =>
        appointmentStatusFactory.build({ appointmentId: appointment.id }),
      )
      const session = sessionFactory.build({ appointmentSummaries })
      cy.task('stubFindSession', { session })
      cy.task('stubGetForm', { sessionOrAppointment: session, appointmentStatuses })

      const sessionPage = SessionPage.visit(session)

      // Then I see saved statuses for each offender
      sessionPage.shouldShowAppointmentsWithStatuses(appointmentStatuses)
    })

    //  Scenario: viewing an in progress session with new appointments
    it('Shows a status for any new appointments', () => {
      // Given I am on a session page for an in progress session
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const appointmentStatuses = appointmentSummaries.map(appointment =>
        appointmentStatusFactory.build({ appointmentId: appointment.id }),
      )

      const newAppointment = appointmentSummaryFactory.build()
      appointmentSummaries.push(newAppointment)
      const session = sessionFactory.build({ appointmentSummaries })
      cy.task('stubFindSession', { session })
      cy.task('stubGetForm', { sessionOrAppointment: session, appointmentStatuses })

      const sessionPage = SessionPage.visit(session)

      // Then I see saved statuses for each offender and statuses for new appointments
      sessionPage.shouldShowAppointmentsWithStatuses([
        ...appointmentStatuses,
        { appointmentId: newAppointment.id, status: 'Scheduled' },
      ])
    })
  })
})
