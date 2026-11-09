//  Feature: View a project session
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to view a project session
//
//  Scenario: viewing the home page
//      Given I am logged in
//      And I am on the home page
//      I should see the search form
//  Scenario: searching for sessions
//      Given I am logged in
//      And I am on the home page
//      And I fill in the search form
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
//  Scenario: viewing a session for an LAO
//    Given I am on a session page where the offenders are LAOs
//    Then I should not see links or names for each LAO
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
import supervisorFactory from '../../server/testutils/factories/supervisorFactory'
import supervisorTeamFactory from '../../server/testutils/factories/supervisorTeamFactory'
import caseDetailsFactory from '../../server/testutils/factories/caseDetailsFactory'
import offenderLimitedFactory from '../../server/testutils/factories/offenderLimitedFactory'
import providerSummaryFactory from '../../server/testutils/factories/providerSummaryFactory'
import providerTeamSummaryFactory from '../../server/testutils/factories/providerTeamSummaryFactory'

context('Home', () => {
  const providers = providerSummaryFactory.buildList(2)
  const provider = providers[0]
  const teams = providerTeamSummaryFactory.buildList(2)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetProviders', { providers: { providers } })
    cy.task('stubGetTeams', { teams: { providers: teams }, providerCode: provider.code })
  })

  //  Scenario: viewing the home page
  it('shows the home page with filters', () => {
    const supervisor = supervisorFactory.build()
    cy.task('stubFindSupervisor', { supervisor })

    // Given I am logged in
    cy.signIn()

    // and I am on the home page
    const page = Page.verifyOnPage(IndexPage)

    //  Then I see the search form
    page.shouldShowSearchForm()
  })

  //  Scenario: searching for sessions
  it('shows a list of next sessions when search filters are applied', () => {
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
    const sessionSummaries = { allocations: [sessionSummary, sessionSummary2] }

    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubFindFilteredSessions', {
      sessionSummaries,
      teamCode: teams[0].code,
      date: '2025-09-18',
    })

    // Given I am logged in
    cy.signIn()

    // And I have filled in the sessions form
    const page = Page.verifyOnPage(IndexPage, [sessionSummary, sessionSummary2])
    page.selectRegion(provider)
    page.selectTeam(teams[0])
    page.enterDate()
    page.submitForm()

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
    const sessionSummary = sessionSummaryFactory.build({
      date: '2025-09-15',
      projectCode: 'N56123456',
      numberOfOffendersAllocated: 1,
    })
    const sessionSummary2 = sessionSummaryFactory.build({
      ...sessionSummary,
      numberOfOffendersAllocated: 2,
    })
    const sessionSummaries = { allocations: [sessionSummary, sessionSummary2] }

    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubFindFilteredSessions', {
      sessionSummaries,
      teamCode: teams[1].code,
      date: '2025-09-18',
    })

    // Given I am logged in
    cy.signIn()

    // And I have filled in the sessions form
    const page = Page.verifyOnPage(IndexPage, [sessionSummary, sessionSummary2])
    page.selectRegion(provider)
    page.selectTeam(teams[1])
    page.enterDate()
    page.submitForm()

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
})

context('Session', () => {
  const providers = providerSummaryFactory.buildList(2)
  const provider = providers[0]
  const teams = providerTeamSummaryFactory.buildList(2)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetProviders', { providers: { providers } })
    cy.task('stubGetTeams', { teams: { providers: teams }, providerCode: provider.code })

    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    const sessionSummaries = { allocations }
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubFindFilteredSessions', {
      sessionSummaries,
      teamCode: teams[1].code,
      date: '2025-09-18',
    })

    // Given I am logged in
    cy.signIn()

    // And I have filled in the sessions form
    const page = Page.verifyOnPage(IndexPage, allocations)
    page.selectRegion(provider)
    page.selectTeam(teams[1])
    page.enterDate()
    page.submitForm()

    const contactOutcomes = contactOutcomesFactory.build({
      contactOutcomes: [contactOutcomeFactory.build({ enforceable: true }), contactOutcomeFactory.build()],
    })
    cy.task('stubGetContactOutcomes', { contactOutcomes })
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

    const caseDetailsSummary = caseDetailsFactory.build({ offender: appointment.offender })
    cy.task('stubGetOffenderSummary', { caseDetailsSummary })

    sessionPage.clickOnAnAppointment()
    //  Then I am taken to the appointment page
    Page.verifyOnPage(AppointmentPage, appointment)
  })

  // Scenario: viewing a session for an LAO
  describe('LAO', () => {
    it('should not show a view link or name for a LAO', () => {
      // Given I am on a session page where the offenders are LAOs
      const appointmentSummaries = [
        appointmentSummaryFactory.build({ offender: offenderLimitedFactory.build() }),
        appointmentSummaryFactory.build({ offender: offenderLimitedFactory.build() }),
      ]
      const session = sessionFactory.build({ appointmentSummaries })
      cy.task('stubFindSession', { session })
      const sessionPage = SessionPage.visit(session)

      // Then I should not see links or names for each LAO
      sessionPage.shouldShowAppointmentsWithNoLink()
      sessionPage.shouldShowAppointmentsWithNoName()
    })
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
