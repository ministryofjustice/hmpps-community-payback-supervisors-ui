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

import Page from '../pages/page'
import SessionPage from '../pages/session'
import sessionFactory from '../../server/testutils/factories/sessionFactory'
import appointmentSummaryFactory from '../../server/testutils/factories/appointmentSummaryFactory'
import AppointmentPage from '../pages/appointment'
import appointmentFactory from '../../server/testutils/factories/appointmentFactory'
import StartTimePage from '../pages/appointments/update/startTimePage'

context('viewAnAppointment', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  //  Scenario: viewing an appointment
  it('Viewing an appointment', () => {
    // Given I am logged in
    cy.signIn()

    //  When I visit an appointment page
    const appointment = appointmentFactory.build()
    cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })

    const appointmentPage = AppointmentPage.visit(appointment)

    // Then I should see the appointment and offender details
    appointmentPage.shouldShowAppointmentDetails()
    appointmentPage.shouldShowOffenderDetails()
  })

  //  Scenario: navigating back to the session page
  it('Navigates back to the session page', () => {
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    const appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })

    // Given I am on an appointment page
    cy.signIn()
    cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
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
      const appointment = appointmentFactory.build()
      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Arrived'
      appointmentPage.clickArrived()

      // Then I should be taken to the first page of the arrival form
      Page.verifyOnPage(StartTimePage, appointment, 'arrived')
    })

    // Scenario: starting an absent form
    it('I can navigate to the absent form', () => {
      // Given I am on the appointment page
      const appointment = appointmentFactory.build()
      cy.signIn()
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })
      const appointmentPage = AppointmentPage.visit(appointment)

      // When I click on 'Not arrived'
      appointmentPage.clickNotArrived()

      // Then I should be taken to the first page of the absent form
      Page.verifyOnPage(StartTimePage, appointment, 'absent')
    })
  })
})
