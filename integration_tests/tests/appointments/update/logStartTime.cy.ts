//  Feature: Log start time for an appointment
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to confirm start time for an appointment
//
//  Scenario: Arrived
//    Scenario: Validates time entered
//      Given I am on the start time page for an arrival form
//      When I submit an invalid time
//      Then I see the same page with errors
//    Scenario: Submitting a valid time
//      Given I am on the start time page for an arrival form
//      When I a submit a valid time
//      Then I see the form next page

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import AbleToWorkPage from '../../../pages/appointments/update/ableToWorkPage'
import StartTimePage from '../../../pages/appointments/update/startTimePage'
import Page from '../../../pages/page'

context('Log start time ', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  describe('attended', () => {
    //  Scenario: Validates time entered
    it('validates the time entered on submit', () => {
      const projectCode = 'some-code'
      const appointment = appointmentFactory.build()
      // Given I am on the start time page for an arrival form
      cy.task('stubFindAppointment', { appointment, projectCode })

      const page = StartTimePage.visit(appointment, projectCode, true)

      // When I submit an invalid time
      page.clearStartTime()
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(StartTimePage, appointment, true)
      page.shouldShowErrorSummary('startTime', 'Enter a start time')
      page.shouldHaveInputValue('startTime', '')
    })

    //  Scenario: Submitting a valid time
    it('submits start time and navigates to next page', () => {
      const projectCode = 'some-code'
      const appointment = appointmentFactory.build({ startTime: '09:00' })
      // Given I am on the start time page for an arrival form
      cy.task('stubFindAppointment', { appointment, projectCode })

      const page = StartTimePage.visit(appointment, projectCode, true)

      // When I submit a valid time
      cy.task('stubUpdateAppointmentOutcome', { appointment, projectCode })
      page.enterStartTime('09:30')
      page.clickSubmit()

      // Then I see the next form page
      Page.verifyOnPage(AbleToWorkPage)
    })
  })
})
