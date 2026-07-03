//  Feature: View an appointment
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to view an appointment
//
//  Scenario: viewing an appointment
//    Given I am on an appointment page
//    Then I should see the appointment, offender, and pick-up details
//
//  Scenario: navigating back to the session page
//    Given I am on an appointment page
//    When I click the back link
//    Then I should be taken to the session page
//
//  Scenario: scheduled appointment
//    Scenario: starting an arrived form
//      Given I am on the appointment page
//      When I click on 'Arrived'
//      Then I should be taken to the first page of the arrival form
//    Scenario: starting an absent form
//      Given I am on the appointment page
//      When I click on 'Did not attend'
//      Then I should be taken to the first page of the absent form
//
//  Scenario: Appointment already with an outcode code
//    Given I am on the appointment page
//    Then I should not see any appointment update actions

import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'
import appointmentSummaryFactory from '../../server/testutils/factories/appointmentSummaryFactory'
import AppointmentPage from '../pages/appointment'
import appointmentFactory from '../../server/testutils/factories/appointmentFactory'
import sessionSummaryFactory from '../../server/testutils/factories/sessionSummaryFactory'
import supervisorFactory from '../../server/testutils/factories/supervisorFactory'
import appointmentOutcomeFormFactory from '../../server/testutils/factories/appointmentOutcomeFormFactory'
import AttendanceOutcomePage from '../pages/appointments/update/attendanceOutcomePage'
import { contactOutcomeFactory, contactOutcomesFactory } from '../../server/testutils/factories/contactOutcomeFactory'
import pickupDataFactory from '../../server/testutils/factories/pickupDataFactory'
import NotesPage from '../pages/appointments/update/notesPage'

context('viewAnAppointment', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries: { allocations }, supervisorTeam: supervisor.unpaidWorkTeams[0] })

    const contactOutcomes = contactOutcomesFactory.build({
      contactOutcomes: [contactOutcomeFactory.build({ enforceable: true }), contactOutcomeFactory.build()],
    })
    cy.task('stubGetContactOutcomes', { contactOutcomes })
  })

  //  Scenario: viewing an appointment
  it('Viewing an appointment', () => {
    // Given I am logged in
    cy.signIn()

    //  When I visit an appointment page
    const appointment = appointmentFactory.build({ pickUpData: pickupDataFactory.build({ time: '09:00' }) })
    cy.task('stubFindAppointment', { appointment })

    const appointmentPage = AppointmentPage.visit(appointment)

    // Then I should see the appointment, offender, and pick-up details
    appointmentPage.shouldShowAppointmentDetails()
    appointmentPage.shouldShowPickUpDetails()
    appointmentPage.shouldShowOffenderDetails()
    appointmentPage.shouldShowStatus('Scheduled')
  })

  //  Scenario: navigating back to the session page
  it('Navigates back to the session page', () => {
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    const appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })

    // Given I am on an appointment page
    cy.signIn()
    cy.task('stubFindAppointment', { appointment })
    const appointmentPage = AppointmentPage.visit(appointment)

    // When I click the back link
    cy.task('stubFindSession', { session })
    appointmentPage.clickBack()

    // Then I should be taken to the session page
    Page.verifyOnPage(SessionPage, session)
  })

  // Scenario: scheduled appointment
  describe('scheduled appointment', () => {
    // Scenario: starting an arrived form
    it('I can navigate to the arrived form', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build({ contactOutcomeCode: undefined })

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      cy.task('stubSaveAppointmentForm')
      cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build() })

      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Arrived'
      appointmentPage.arrivedButton().click()

      // Then I should be taken to the first page of the arrival form
      Page.verifyOnPage(AttendanceOutcomePage, appointment)
    })

    // Scenario: starting an absent form
    it('I can navigate to the absent form', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build({ contactOutcomeCode: undefined })

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      cy.task('stubSaveAppointmentForm')
      cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build() })

      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Did not attend'
      appointmentPage.notArrivedButton().click()

      // Then I should be taken to the first page of the absent form
      Page.verifyOnPage(NotesPage, appointment, 'absent')
    })
  })

  describe('A complete appointment', () => {
    // Scenario: Appointment already with an outcode code
    it('has no available actions', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build()

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })

      const appointmentPage = AppointmentPage.visit(appointment)

      // Then I should not see any appointment update actions
      appointmentPage.shouldNotHaveAnyActions()
    })
  })
})
