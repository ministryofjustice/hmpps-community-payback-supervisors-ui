//  Feature: Log whether a person is able to work
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to confirm whether a person is able to work
//
//  Scenario: Validates form
//    Given I am on the able to work page
//    When I submit without selecting an answer
//    Then I see the same page with errors
//
//  Context: when the person is able to work
//    Scenario: Confirms the person can work
//      Given I am on the able to work page
//      And I select yes
//      When I submit the form
//      Then I am taken to the confirmation page
//
//    Scenario: Navigates from confirm working page to session page
//      Given I am on the confirm working page
//      And I click the return to session link
//      Then I am taken to the session page
//

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentSummaryFactory from '../../../../server/testutils/factories/appointmentSummaryFactory'
import sessionFactory from '../../../../server/testutils/factories/sessionFactory'
import AbleToWorkPage from '../../../pages/appointments/update/ableToWorkPage'
import ConfirmWorkingPage from '../../../pages/appointments/update/confirmWorkingPage'
import Page from '../../../pages/page'
import SessionPage from '../../../pages/session'

context('Log able to work ', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
  })

  //  Scenario: validates form
  it('validates the form', () => {
    const appointment = appointmentFactory.build()
    // Given I am on the able to work page
    cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })

    const page = AbleToWorkPage.visit(appointment)

    // When I submit without selecting an answer
    page.clickSubmit()

    // Then I see the same page with errors
    Page.verifyOnPage(AbleToWorkPage, appointment)
    page.shouldShowErrorSummary('ableToWork', 'Select whether the person is able to work today')
  })

  describe('when the person is able to work', () => {
    //  Scenario: Confirms the person can work
    it('submits form and navigates to confirmation page', () => {
      const appointment = appointmentFactory.build()
      // Given I am on the able to work page
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })

      const page = AbleToWorkPage.visit(appointment)

      // And I select yes
      page.selectYes()

      // When I submit the form
      page.clickSubmit()

      // Then I am taken to the confirm working page
      Page.verifyOnPage(ConfirmWorkingPage, appointment)
    })

    //  Scenario: Navigates from confirm working page to session page
    it('navigates from confirm working page to session page', () => {
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      const appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })

      // Given I am on the confirm working page
      cy.task('stubFindAppointment', { appointment, projectCode: appointment.projectCode })

      const page = ConfirmWorkingPage.visit(appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })
})
