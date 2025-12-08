//  Feature: View an appointment
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to view an appointment
//
//  Scenario: viewing an appointment
//    Given I am on an appointment page
//    Then I should see the appointment and offender details
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
//      When I click on 'Not arrived'
//      Then I should be taken to the first page of the absent form
//  Scenario: working appointment
//    Scenario: starting a finish session form
//    Given I am on the appointment page
//    When I click on 'Finished'
//    Then I should be taken to the first page of the finish session form

import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'
import appointmentSummaryFactory from '../../server/testutils/factories/appointmentSummaryFactory'
import AppointmentPage from '../pages/appointment'
import appointmentFactory from '../../server/testutils/factories/appointmentFactory'
import StartTimePage from '../pages/appointments/update/startTimePage'
import appointmentStatusFactory from '../../server/testutils/factories/appointmentStatusFactory'
import EndTimePage from '../pages/appointments/update/endTimePage'
import sessionSummaryFactory from '../../server/testutils/factories/sessionSummaryFactory'

context('viewAnAppointment', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    const sessionSummary = sessionSummaryFactory.build({ date: '2025-09-15' })
    cy.task('stubNextSessions', { sessionSummary })
  })

  //  Scenario: viewing an appointment
  it('Viewing an appointment', () => {
    // Given I am logged in
    cy.signIn()

    //  When I visit an appointment page
    const appointment = appointmentFactory.build()
    const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id })
    cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })
    cy.task('stubFindAppointment', { appointment })

    const appointmentPage = AppointmentPage.visit(appointment)

    // Then I should see the appointment and offender details
    appointmentPage.shouldShowAppointmentDetails()
    appointmentPage.shouldShowOffenderDetails()
    appointmentPage.shouldShowStatus(appointmentStatus.status)
  })

  //  Scenario: navigating back to the session page
  it('Navigates back to the session page', () => {
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    const appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })
    const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id })
    const appointmentStatuses = appointmentSummaries.map(appointmentSummary =>
      appointmentStatusFactory.build({ appointmentId: appointmentSummary.id }),
    )

    // Given I am on an appointment page
    cy.signIn()
    cy.task('stubFindAppointment', { appointment })
    cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })
    const appointmentPage = AppointmentPage.visit(appointment)

    // When I click the back link
    cy.task('stubFindSession', { session })
    cy.task('stubGetForm', { sessionOrAppointment: session, appointmentStatuses })
    appointmentPage.clickBack()

    // Then I should be taken to the session page
    Page.verifyOnPage(SessionPage, session)
  })

  // Scenario: scheduled appointment
  describe('scheduled appointment', () => {
    // Scenario: starting an arrived form
    it('I can navigate to the arrived form', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build()
      const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id, status: 'Scheduled' })

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })

      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Arrived'
      appointmentPage.arrivedButton().click()

      // Then I should be taken to the first page of the arrival form
      Page.verifyOnPage(StartTimePage, appointment, 'arrived')
    })

    // Scenario: starting an absent form
    it('I can navigate to the absent form', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build()
      const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id, status: 'Scheduled' })

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })

      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Not arrived'
      appointmentPage.notArrivedButton().click()

      // Then I should be taken to the first page of the absent form
      Page.verifyOnPage(StartTimePage, appointment, 'absent')
    })
  })

  // Scenario: working appointment
  describe('working appointment', () => {
    // Scenario: starting a finish session form
    it('I can navigate to the finish session form', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build()
      const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id, status: 'Working' })

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })

      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Finished'
      appointmentPage.finishedButton().click()

      // Then I should be taken to the first page of the finish session form
      Page.verifyOnPage(EndTimePage, appointment, 'completed')
    })
  })

  describe('absent appointment', () => {
    it('should not have any available actions', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build()
      const appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id, status: 'Absent' })

      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      cy.task('stubGetForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })

      const appointmentPage = AppointmentPage.visit(appointment)

      // Then I should not see any appointment update actions
      appointmentPage.shouldNotHaveAnyActions()
    })
  })
})
