//  Feature: Log start time for an appointment
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to confirm start time for an appointment
//
//  Scenario: Validates time entered
//    Given I am on the start time page for an arrival form
//    When I visit a submit an invalid time
//    Then I see the same page with errors
//

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import StartTimePage from '../../../pages/appointments/update/startTimePage'
import Page from '../../../pages/page'

context('Log start time ', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  //  Scenario: viewing the home page
  it('shows the find a session search form', () => {
    const projectCode = 'some-code'
    const appointment = appointmentFactory.build()
    // Given I am on the start time page for an arrival form
    cy.task('stubFindAppointment', { appointment, projectCode })

    const page = StartTimePage.visit(appointment, projectCode, true)

    // When I visit a submit an invalid time
    page.clearStartTime()
    page.clickSubmit()

    // Then I see the same page with errors
    Page.verifyOnPage(StartTimePage, appointment, true)
    page.shouldShowErrorSummary('startTime', 'Enter a start time')
    page.shouldHaveInputValue('startTime', '')
  })
})
