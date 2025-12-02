//  Feature: Update log compliance
//    As a case administrator
//    I want to update the log compliance on for an offender
//    So that I can track progress for an unpaid work order

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import ConfirmCompletedPage from '../../../pages/appointments/update/confirm/confirmCompletedPage'
import EndTimePage from '../../../pages/appointments/update/endTimePage'
import CompliancePage from '../../../pages/appointments/update/compliancePage'
import Page from '../../../pages/page'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import ConfirmLeftEarlyPage from '../../../pages/appointments/update/confirm/confirmLeftEarlyPage'

//  Scenario: Validating the log compliance page
//    Given I am on the log compliance page for an appointment
//    And I do not complete the form
//    When I submit the form
//    Then I see the log compliance page with errors

// Scenario: Viewing error messages for submitted answers
//    Given I am on the log compliance page for an appointment
//    And I complete some of the form
//    When I submit the form
//    Then I see the log compliance page with errors and my entered answers

// Scenario: Completed
//    Scenario: Completing the log compliance page
//      Given I am on the log compliance page for an appointment
//      And I complete the form
//      When I submit the form
//      Then I see the confirm details page
//    Scenario: Returning to the log hours page
//      Given I am on the log compliance page for an appointment
//      When I click back
//      Then I see the log hours page

// Scenario: Left early
//    Scenario: Completing the log compliance page
//      Given I am on the log compliance page for an appointment
//      And I complete the form
//      When I submit the form
//      Then I see the confirm left early page
//    Scenario: Returning to the log hours page
//      Given I am on the log compliance page for an appointment
//      When I click back
//      Then I see the log hours page

context('Log compliance', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    const sessionSummary = sessionSummaryFactory.build({ date: '2025-09-15' })
    cy.task('stubNextSessions', { sessionSummary })

    cy.signIn()

    const appointment = appointmentFactory.build({})
    cy.wrap(appointment).as('appointment')
  })

  describe('Validation', () => {
    // Scenario: Validating the log compliance page
    it('validates form data', () => {
      const appointment = appointmentFactory.build({
        attendanceData: {
          hiVisWorn: null,
          workedIntensively: null,
          workQuality: null,
          behaviour: null,
        },
      })
      // Given I am on the log compliance page for an appointment
      cy.task('stubFindAppointment', { appointment })
      const page = CompliancePage.visit(appointment, 'completed', 'ATSS')

      // And I do not complete the form

      // When I submit the form
      page.clickSubmit()

      // Then I see the log compliance page with errors
      page.shouldShowErrorSummary('hiVis', 'Select whether a Hi-Vis was worn')
      page.shouldShowErrorSummary('workedIntensively', 'Select whether they worked intensively')
      page.shouldShowErrorSummary('workQuality', 'Select their work quality')
      page.shouldShowErrorSummary('behaviour', 'Select their behaviour')
    })

    // Scenario: Viewing error messages for submitted answers
    it('should show user submitted values when showing validation errors', () => {
      const appointment = appointmentFactory.build({
        attendanceData: {
          hiVisWorn: null,
          workedIntensively: null,
          workQuality: null,
          behaviour: null,
        },
      })
      // Given I am on the log compliance page for an appointment
      cy.task('stubFindAppointment', { appointment })
      const page = CompliancePage.visit(appointment, 'completed', 'ATSS')

      // And I complete some of the form
      page.selectHiVisValue()
      page.selectWorkedIntensivelyValue()
      page.selectWorkQualityValue()
      page.enterNotes()

      // When I submit the form
      page.clickSubmit()

      // Then I see the log compliance page with errors and my entered answers
      page.shouldShowErrorSummary('behaviour', 'Select their behaviour')
      page.shouldHaveSelectedHiVisValue()
      page.shouldHaveSelectedWorkedIntensivelyValue()
      page.shouldHaveSelectedWorkQualityValue()
      page.shouldHaveEnteredNotes()
    })
  })

  describe('completed', function scenario() {
    describe('submit', function describe() {
      // Scenario: Completing the log compliance page
      it('submits the form and navigates to the next page', function test() {
        // Given I am on the log compliance page for an appointment
        cy.task('stubFindAppointment', { appointment: this.appointment })
        const page = CompliancePage.visit(this.appointment, 'completed', 'ATSS')

        // When I submit the form
        cy.task('stubUpdateAppointmentOutcome', { appointment: this.appointment })
        cy.task('stubSaveForm', { sessionOrAppointment: this.appointment })
        page.clickSubmit()

        // Then I see the confirm details page
        Page.verifyOnPage(ConfirmCompletedPage, this.appointment)
      })
    })

    //  Scenario: Returning to log hours page
    it('navigates back to the previous page', function test() {
      // Given I am on the log compliance page for an appointment
      cy.task('stubFindAppointment', { appointment: this.appointment })
      const page = CompliancePage.visit(this.appointment, 'completed', 'ATSS')

      // When I click back
      page.clickBack()

      // Then I see the log hours page
      Page.verifyOnPage(EndTimePage, this.appointment, 'completed')
    })
  })

  describe('left early', function scenario() {
    describe('submit', function describe() {
      // Scenario: Completing the log compliance page
      it('submits the form and navigates to the next page', function test() {
        // Given I am on the log compliance page for an appointment
        cy.task('stubFindAppointment', { appointment: this.appointment })
        const page = CompliancePage.visit(this.appointment, 'leftEarly', 'ATSS')

        // When I submit the form
        cy.task('stubUpdateAppointmentOutcome', { appointment: this.appointment })
        cy.task('stubSaveForm', { sessionOrAppointment: this.appointment })

        page.clickSubmit()

        // Then I see the confirm left early page
        Page.verifyOnPage(ConfirmLeftEarlyPage, this.appointment)
      })
    })

    //  Scenario: Returning to log hours page
    it('navigates back to the previous page', function test() {
      // Given I am on the log compliance page for an appointment
      cy.task('stubFindAppointment', { appointment: this.appointment })
      const page = CompliancePage.visit(this.appointment, 'leftEarly', 'ATSS')

      // When I click back
      page.clickBack()

      // Then I see the log hours page
      Page.verifyOnPage(EndTimePage, this.appointment, 'leftEarly')
    })
  })
})
