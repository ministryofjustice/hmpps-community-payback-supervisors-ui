//  Feature: View a project session
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to view a project session
//
//  Scenario: viewing a session page
//      Given I am logged in
//      When I visit a session page
//      Then I see the session details
//  Scenario: viewing the home page with multiple teams
//    Given I am logged in
//    Then I see session details for all of the sessions for my teams
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

import IndexPage from '../pages'
import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'
import appointmentSummaryFactory from '../../server/testutils/factories/appointmentSummaryFactory'
import AppointmentPage from '../pages/appointment'
import appointmentFactory from '../../server/testutils/factories/appointmentFactory'
import sessionSummaryFactory from '../../server/testutils/factories/sessionSummaryFactory'
import { contactOutcomeFactory, contactOutcomesFactory } from '../../server/testutils/factories/contactOutcomeFactory'
import { SessionSummariesDto } from '../../server/@types/shared'
import supervisorFactory from '../../server/testutils/factories/supervisorFactory'
import supervisorTeamFactory from '../../server/testutils/factories/supervisorTeamFactory'

context('Home', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  //  Scenario: viewing the home page
  it('shows a list of next sessions', () => {
    const sessionSummary = sessionSummaryFactory.build({
      date: '2025-09-15',
      projectCode: 'N56123456',
      numberOfOffendersAllocated: 1,
    })
    const sessionSummary2 = sessionSummaryFactory.build({
      ...sessionSummary,
      numberOfOffendersAllocated: 2,
    })

    const supervisor = supervisorFactory.build()
    const sessionSummaries = { allocations: [sessionSummary, sessionSummary2] } as SessionSummariesDto

    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries, teamCodes: [supervisor.unpaidWorkTeams[0].code] })

    // Given I am logged in
    cy.signIn()

    const page = Page.verifyOnPage(IndexPage, [sessionSummary, sessionSummary2])
    page.shouldShowSessionSummaryDetails()
    page.shouldContainPersonTextForSession(0)
    page.shouldContainPeopleTextForSession(1)

    //  When I visit a session page
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries, projectCode: 'N56123456', date: '2025-09-15' })
    cy.task('stubFindSession', { session })
    page.clickViewSession()

    //  Then I see the session details
    const sessionPage = Page.verifyOnPage(SessionPage, session)
    sessionPage.shouldShowSessionDetails()
    sessionPage.shouldShowAppointmentsForEachOffender()
  })

  //  Scenario: viewing the home page with multiple teams
  it('shows a list of next sessions for a supervisor on two teams', () => {
    const unpaidWorkTeams = supervisorTeamFactory.buildList(2)
    const supervisor = supervisorFactory.build({ unpaidWorkTeams })
    const allocations = sessionSummaryFactory.buildList(4)

    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', {
      sessionSummaries: { allocations },
      teamCodes: unpaidWorkTeams.map(team => team.code),
    })

    // Given I am logged in
    cy.signIn()

    //  Then I see session details for all of the sessions for my teams
    const page = Page.verifyOnPage(IndexPage, allocations)
    page.shouldShowSessionSummaryDetails()
  })
})

context('Session', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries: { allocations }, teamCodes: [supervisor.unpaidWorkTeams[0].code] })

    const contactOutcomes = contactOutcomesFactory.build({
      contactOutcomes: [contactOutcomeFactory.build({ enforceable: true }), contactOutcomeFactory.build()],
    })
    cy.task('stubGetContactOutcomes', { contactOutcomes })

    cy.signIn()
  })

  //  Scenario: viewing an individual appointment
  it('Viewing a person on a session', () => {
    // Given I am on a session page
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    cy.task('stubFindSession', { session })
    const sessionPage = SessionPage.visit(session)

    const appointment = appointmentFactory.build({ id: appointmentSummaries[0].id, projectCode: session.projectCode })
    //  When I click on an appointment
    cy.task('stubFindAppointment', { appointment })

    sessionPage.clickOnAnAppointment()
    //  Then I am taken to the appointment page
    Page.verifyOnPage(AppointmentPage, appointment)
  })

  // Scenario: Viewing statuses
  describe('statuses', () => {
    //  Scenario: viewing a new session with no appointment statuses saved
    it('Viewing a new session with no statuses', () => {
      const contactOutcome = contactOutcomeFactory.build()
      // Given I am on a session page for a new session
      const appointmentSummaries = [
        appointmentSummaryFactory.build({ contactOutcome: null }),
        appointmentSummaryFactory.build({ contactOutcome }),
      ]
      const session = sessionFactory.build({ appointmentSummaries })
      cy.task('stubFindSession', { session })
      const sessionPage = SessionPage.visit(session)

      // Then I see scheduled statuses for each offender
      sessionPage.shouldShowAppointmentsWithStatuses(['Scheduled', contactOutcome.name])
    })

    //  Scenario: viewing a session's existing appointment statuses
    it('shows existing statuses if they exist', () => {
      // Given I am on a session page for an in progress session
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      cy.task('stubFindSession', { session })

      const sessionPage = SessionPage.visit(session)

      // Then I see saved statuses for each offender
      sessionPage.shouldShowAppointmentsWithStatuses(
        appointmentSummaries.map(appointment => appointment.contactOutcome?.name),
      )
    })
  })
})
