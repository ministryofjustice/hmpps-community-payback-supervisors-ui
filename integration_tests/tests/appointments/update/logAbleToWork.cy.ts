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
//  Context: when the person is not able to work
//    Scenario: Confirms the person cannot work
//      Given I am on the able to work page
//      And I select no
//      When I submit the form
//      Then I am taken to the unable to work reason page
//
//    Scenario: Validates the unable to work reason form
//      Given I am on the unable to work reason page
//      And I do not select a reason
//      When I submit the form
//      Then I see the same page with errors
//
//    Scenario: Confirms the reason the person cannot work
//      Given I am on the unable to work reason page
//      And I select a reason
//      When I submit the form
//      Then I am taken to the confirm unable to work page
//
//    Scenario: Navigates from confirm unable to work page to session page
//      Given I am on the confirm unable to work page
//      And I click the return to session link
//      Then I am taken to the session page
//

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentSummaryFactory from '../../../../server/testutils/factories/appointmentSummaryFactory'
import { contactOutcomeFactory } from '../../../../server/testutils/factories/contactOutcomeFactory'
import sessionFactory from '../../../../server/testutils/factories/sessionFactory'
import IsAbleToWorkPage from '../../../pages/appointments/update/isAbleToWorkPage'
import ConfirmUnableToWorkPage from '../../../pages/appointments/update/confirm/confirmUnableToWorkPage'
import ConfirmWorkingPage from '../../../pages/appointments/update/confirm/confirmWorkingPage'
import UnableToWorkPage from '../../../pages/appointments/update/unableToWorkPage'
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
    cy.task('stubFindAppointment', { appointment })

    const page = IsAbleToWorkPage.visit(appointment)

    // When I submit without selecting an answer
    page.clickSubmit()

    // Then I see the same page with errors
    Page.verifyOnPage(IsAbleToWorkPage, appointment)
    page.shouldShowErrorSummary('ableToWork', 'Select whether the person is able to work today')
  })

  //  Context: when the person is able to work
  describe('when the person is able to work', () => {
    //  Scenario: Confirms the person can work
    it('submits form and navigates to confirmation page', () => {
      const appointment = appointmentFactory.build()
      // Given I am on the able to work page
      cy.task('stubFindAppointment', { appointment })

      const page = IsAbleToWorkPage.visit(appointment)

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
      cy.task('stubFindAppointment', { appointment })

      const page = ConfirmWorkingPage.visit(appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })

  //  Context: when the person is not able to work
  describe('when the person is not able to work', () => {
    beforeEach(() => {
      cy.fixture('contactOutcomes.json').then(contactOutcomesData => {
        const contactOutcomes = {
          contactOutcomes: contactOutcomesData.map((outcome: Record<string, string>) => {
            return contactOutcomeFactory.build({
              code: outcome.code,
              name: outcome.name,
            })
          }),
        }

        cy.wrap(contactOutcomes).as('contactOutcomes')
      })
    })

    //  Scenario: Confirms the person cannot work
    it('submits form and navigates to unable to work page', function test() {
      const appointment = appointmentFactory.build()
      // Given I am on the able to work page
      cy.task('stubFindAppointment', { appointment })
      cy.task('stubGetContactOutcomes', { contactOutcomes: this.contactOutcomes })

      const page = IsAbleToWorkPage.visit(appointment)

      // And I select no
      page.selectNo()

      // When I submit the form
      page.clickSubmit()

      // Then I am taken to the unable to work reason page
      Page.verifyOnPage(UnableToWorkPage, appointment)
    })

    //  Scenario: validates form
    it('validates the form', function test() {
      const appointment = appointmentFactory.build()
      // Given I am on the unable to work page
      cy.task('stubFindAppointment', { appointment })
      cy.task('stubGetContactOutcomes', { contactOutcomes: this.contactOutcomes })

      const page = UnableToWorkPage.visit(appointment)

      // And I do not select a reason

      // When I submit the form
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(UnableToWorkPage, appointment)
      page.shouldShowErrorSummary('unableToWork', 'Select the reason why the person is unable to work today')
    })

    // Scenario: Confirms the reason the person cannot work
    it('submits form and navigates to confirm unable to work page', function test() {
      const appointment = appointmentFactory.build()
      // Given I am on the unable to work page
      cy.task('stubFindAppointment', { appointment })
      cy.task('stubGetContactOutcomes', { contactOutcomes: this.contactOutcomes })
      cy.task('stubUpdateAppointmentOutcome', { appointment })

      const page = UnableToWorkPage.visit(appointment)

      // And I select a reason
      page.selectSentHomeServiceIssues()

      // When I submit the form
      page.clickSubmit()

      // Then I am taken to the confirm unable to work page
      Page.verifyOnPage(ConfirmUnableToWorkPage, appointment)
    })

    //  Scenario: Navigates from confirm unable to work page to session page
    it('navigates from confirm working page to session page', function test() {
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      const appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })

      // Given I am on the confirm unable to work page
      cy.task('stubFindAppointment', { appointment })
      cy.task('stubGetContactOutcomes', { contactOutcomes: this.contactOutcomes })

      const page = ConfirmUnableToWorkPage.visit(appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })
})
