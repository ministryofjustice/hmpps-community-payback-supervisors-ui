//  Feature: Log finish time for an appointment
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to confirm finish time for an appointment
//
//  Scenario: Finish session
//    Scenario: Validates time entered
//      Given I am on the end time page for a finish session form
//      When I submit an invalid time
//      Then I see the same page with errors
//    Scenario: Submitting a valid time
//      Given I am on the end time page for a finish session form
//      When I a submit a valid time
//      Then I see the form next page
//
//  Scenario: Left early session
//    Scenario: Validates time entered
//      Given I am on the end time page for a left early session form
//      When I submit an invalid time
//      Then I see the same page with errors
//    Scenario: Submitting a valid time
//      Given I am on the end time page for a left early session form
//      When I a submit a valid time
//      Then I see the form next page

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentStatusFactory from '../../../../server/testutils/factories/appointmentStatusFactory'

import Page from '../../../pages/page'
import { AppointmentDto } from '../../../../server/@types/shared'
import { AppointmentStatus } from '../../../../server/services/appointmentStatusService'
import EndTimePage from '../../../pages/appointments/update/endTimePage'
import CompliancePage from '../../../pages/appointments/update/compliancePage'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import LeftEarlyReasonPage from '../../../pages/appointments/update/leftEarlyReasonPage'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'

context('Log finish time ', () => {
  let appointment: AppointmentDto
  let appointmentStatus: AppointmentStatus

  beforeEach(() => {
    appointment = appointmentFactory.build()
    appointmentStatus = appointmentStatusFactory.build({ appointmentId: appointment.id })
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetStatusesForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatus] })
    cy.task('stubFindAppointment', { appointment })
    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries: { allocations }, supervisorTeam: supervisor.unpaidWorkTeams[0] })
    cy.task('stubSaveAppointmentForm')
    cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build() })

    cy.signIn()
  })

  //  Scenario: Finish session
  describe('completed', () => {
    //  Scenario: Validates time entered
    it('validates the time entered on submit', () => {
      // Given I am on the end time page for a completed session form
      const page = EndTimePage.visit(appointment, 'completed')

      cy.task('stubGetAppointmentForm', appointmentOutcomeFormFactory.build())

      // When I submit an invalid time
      page.clearTime()
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(EndTimePage, appointment, 'completed')
      page.shouldShowValidationErrors()
      page.shouldHaveTimeValue('')
    })

    it('validates the entered time is before start time on submit', () => {
      // Given I am on the end time page for a completed session form
      const page = EndTimePage.visit(appointment, 'completed')

      // When I submit an invalid time
      page.enterTime('07:00')
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(EndTimePage, appointment, 'completed')
      page.shouldShowStartTimeValidationErrors()
      page.shouldHaveTimeValue('07:00')
    })

    //  Scenario: Submitting a valid time
    it('submits end time and navigates to next page', () => {
      // Given I am on the end time page for an arrival form
      const page = EndTimePage.visit(appointment, 'completed')

      // When I submit a valid time
      cy.task('stubUpdateAppointmentOutcome', { appointment })
      page.enterTime('09:30')
      page.clickSubmit()

      // Then I see the next form page
      Page.verifyOnPage(CompliancePage, appointment)
    })
  })

  //  Scenario: Left early session
  describe('leftEarly', () => {
    //  Scenario: Validates time entered
    it('validates the time entered on submit', () => {
      // Given I am on the end time page for a left early journey
      const page = EndTimePage.visit(appointment, 'leftEarly')

      // When I submit an invalid time
      page.clearTime()
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(EndTimePage, appointment, 'leftEarly')
      page.shouldShowValidationErrors()
      page.shouldHaveTimeValue('')
    })

    it('validates the entered time is before end time on submit', () => {
      // Given I am on the end time page for a left early journey
      const page = EndTimePage.visit(appointment, 'leftEarly')

      // When I submit an invalid time
      page.enterTime('07:00')
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(EndTimePage, appointment, 'leftEarly')
      page.shouldShowStartTimeValidationErrors()
      page.shouldHaveTimeValue('07:00')
    })

    //  Scenario: Submitting a valid time
    it('submits end time and navigates to next page', () => {
      // Given I am on the end time page for a left early journey
      const page = EndTimePage.visit(appointment, 'leftEarly')

      // When I submit a valid time
      cy.task('stubUpdateAppointmentOutcome', { appointment })
      cy.task('stubGetContactOutcomes')
      page.enterTime('09:30')
      page.clickSubmit()

      // Then I see the next form page
      Page.verifyOnPage(LeftEarlyReasonPage, appointment)
    })
  })
})
