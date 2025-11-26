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
//  Scenario: Absent
//    Scenario: Validates time entered
//      Given I am on the start time page for an absent form
//      When I submit an invalid time
//      Then I see the same page with errors
//    Scenario: Submitting a valid time
//      Given I am on the start time page for an absent form
//      When I a submit a valid time
//      Then I see the form next page
//    Scenario: Navigates from confirm absent page to session page
//      Given I am on the confirm page
//      And I click the return to session link
//      Then I am taken to the session page

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentStatusFactory from '../../../../server/testutils/factories/appointmentStatusFactory'
import appointmentSummaryFactory from '../../../../server/testutils/factories/appointmentSummaryFactory'
import sessionFactory from '../../../../server/testutils/factories/sessionFactory'
import IsAbleToWorkPage from '../../../pages/appointments/update/isAbleToWorkPage'
import ConfirmAbsentPage from '../../../pages/appointments/update/confirm/confirmAbsentPage'
import StartTimePage from '../../../pages/appointments/update/startTimePage'
import Page from '../../../pages/page'
import SessionPage from '../../../pages/session'

context('Log start time ', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  //  Scenario: Arrived
  describe('arrived', () => {
    //  Scenario: Validates time entered
    it('validates the time entered on submit', () => {
      const appointment = appointmentFactory.build()
      // Given I am on the start time page for an arrival form
      cy.task('stubFindAppointment', { appointment })

      const page = StartTimePage.visit(appointment, 'arrived')

      // When I submit an invalid time
      page.clearStartTime()
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(StartTimePage, appointment, 'arrived')
      page.shouldShowErrorSummary('startTime', 'Enter a start time')
      page.shouldHaveInputValue('startTime', '')
    })

    //  Scenario: Submitting a valid time
    it('submits start time and navigates to next page', () => {
      const appointment = appointmentFactory.build({ startTime: '09:00' })
      // Given I am on the start time page for an arrival form
      cy.task('stubFindAppointment', { appointment })

      const page = StartTimePage.visit(appointment, 'arrived')

      // When I submit a valid time
      cy.task('stubUpdateAppointmentOutcome', { appointment })
      page.enterStartTime('09:30')
      page.clickSubmit()

      // Then I see the next form page
      Page.verifyOnPage(IsAbleToWorkPage, appointment)
    })
  })

  //  Scenario: Absent
  describe('absent', () => {
    //  Scenario: Validates time entered
    it('validates the time entered on submit', () => {
      const appointment = appointmentFactory.build()
      // Given I am on the start time page for an absent form
      cy.task('stubFindAppointment', { appointment })

      const page = StartTimePage.visit(appointment, 'absent')

      // When I submit an invalid time
      page.clearStartTime()
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(StartTimePage, appointment, 'absent')
      page.shouldShowErrorSummary('startTime', 'Enter a start time')
      page.shouldHaveInputValue('startTime', '')
    })

    //  Scenario: Submitting a valid time
    it('submits start time and navigates to next page', () => {
      const appointment = appointmentFactory.build({ startTime: '09:00' })
      // Given I am on the start time page for an absent form
      cy.task('stubFindAppointment', { appointment })

      const page = StartTimePage.visit(appointment, 'absent')

      // When I submit a valid time
      cy.task('stubUpdateAppointmentOutcome', { appointment })
      page.enterStartTime('09:30')
      page.clickSubmit()

      // Then I see the next form page
      Page.verifyOnPage(ConfirmAbsentPage, appointment)
    })

    //  Scenario: Navigates from confirm absent page to session page
    it('navigates from confirm working page to session page', () => {
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      const appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })
      const appointmentStatuses = appointmentSummaries.map(appointmentSummary =>
        appointmentStatusFactory.build({ appointmentId: appointmentSummary.id }),
      )

      // Given I am on the confirm page
      cy.task('stubFindAppointment', { appointment })

      const page = ConfirmAbsentPage.visit(appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      cy.task('stubGetForm', { session, appointmentStatuses })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })
})
