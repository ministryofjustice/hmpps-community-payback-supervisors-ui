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
//      Then I am taken to the end time page
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
//      Then I am taken to the end time page
//
//    Scenario: Validates the unable to work reason form
//      Given I am on the unable to work reason page
//      And I do not select a reason
//      And I enter a note longer than 4000 characters
//      When I submit the form
//      Then I see the same page with errors
//      And the notes field is populated with the user's input
//
//    Scenario: Confirms the reason the person cannot work
//      Given I am on the unable to work reason page
//      And I select a reason
//      And I enter a note 4000 characters long
//      And I check "This information is not to be shared with the person on probation"
//      When I submit the form
//      Then I am taken to the confirm unable to work page
//
//    Scenario: Navigates from confirm unable to work page to session page
//      Given I am on the confirm unable to work page
//      And I click the return to session link
//      Then I am taken to the session page
//

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentStatusFactory from '../../../../server/testutils/factories/appointmentStatusFactory'
import appointmentSummaryFactory from '../../../../server/testutils/factories/appointmentSummaryFactory'
import sessionFactory from '../../../../server/testutils/factories/sessionFactory'
import IsAbleToWorkPage from '../../../pages/appointments/update/isAbleToWorkPage'
import ConfirmUnableToWorkPage from '../../../pages/appointments/update/confirm/confirmUnableToWorkPage'
import ConfirmWorkingPage from '../../../pages/appointments/update/confirm/confirmWorkingPage'
import UnableToWorkPage from '../../../pages/appointments/update/unableToWorkPage'
import Page from '../../../pages/page'
import SessionPage from '../../../pages/session'
import { AppointmentDto } from '../../../../server/@types/shared'
import { AppointmentStatus } from '../../../../server/services/appointmentStatusService'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'
import ReviewPage from '../../../pages/appointments/update/reviewPage'
import EndTimePage from '../../../pages/appointments/update/endTimePage'

context('Log able to work ', () => {
  let appointment: AppointmentDto
  let appointmentStatus: AppointmentStatus
  const formId = 'some-form'

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
    cy.task('stubSaveAppointmentForm', { formId })
    cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build(), formId })

    cy.signIn()
  })

  //  Scenario: validates form
  it('validates the form', () => {
    // Given I am on the able to work page
    const page = IsAbleToWorkPage.visit(appointment, formId)

    // When I submit without selecting an answer
    page.clickSubmit()

    // Then I see the same page with errors
    Page.verifyOnPage(IsAbleToWorkPage, appointment)
    page.shouldShowErrorSummary('ableToWork', 'Select yes if they are able to work')
  })

  //  Context: when the person is able to work
  describe('when the person is able to work', () => {
    //  Scenario: Confirms the person can work
    it('submits form and navigates to confirmation page', () => {
      // Given I am on the able to work page
      const page = IsAbleToWorkPage.visit(appointment, formId)

      // And I select yes
      page.selectYes()

      // When I submit the form
      cy.task('stubSaveStatusesForm', { sessionOrAppointment: appointment })
      page.clickSubmit()

      // Then I am taken to the end time page
      Page.verifyOnPage(EndTimePage, appointment, 'completed')
    })

    //  Scenario: Navigates from confirm working page to session page
    it('navigates from confirm working page to session page', () => {
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })
      const appointmentStatuses = appointmentSummaries.map(appointmentSummary =>
        appointmentStatusFactory.build({ appointmentId: appointmentSummary.id }),
      )

      // Given I am on the confirm working page
      cy.task('stubFindAppointment', { appointment })
      cy.task('stubGetStatusesForm', {
        sessionOrAppointment: appointment,
        appointmentStatuses: [appointmentStatuses[0]],
      })

      const page = ConfirmWorkingPage.visit(appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      cy.task('stubGetStatusesForm', { sessionOrAppointment: session, appointmentStatuses })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })

  //  Context: when the person is not able to work
  describe('when the person is not able to work', () => {
    //  Scenario: Confirms the person cannot work
    it('submits form and navigates to end time page', function test() {
      // Given I am on the able to work page
      cy.task('stubGetContactOutcomes')

      const page = IsAbleToWorkPage.visit(appointment, formId)

      // And I select no
      page.selectNo()

      // When I submit the form
      page.clickSubmit()

      // Then I am taken to the end time page
      Page.verifyOnPage(EndTimePage, appointment, 'arrived')
    })

    //  Scenario: validates form
    it('validates the form', function test() {
      // Given I am on the unable to work page
      cy.task('stubGetContactOutcomes')

      const page = UnableToWorkPage.visit(appointment, formId)

      // And I do not select a reason

      // And I enter a note longer than 4000 characters
      page.enterNotesWithCharacterLength(4001)

      // When I submit the form
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(UnableToWorkPage, appointment)
      page.shouldShowErrorSummary('unableToWork', 'Select the reason why the person is unable to work today')
      page.shouldShowErrorSummary('notes', 'Notes must be 4000 characters or less')

      // And the notes field is populated with the user's input
      page.shouldShowSubmittedNotes()
    })

    // Scenario: Confirms the reason the person cannot work
    it('submits form and navigates to confirm unable to work page', function test() {
      // Given I am on the unable to work page
      cy.task('stubGetContactOutcomes')
      cy.task('stubUpdateAppointmentOutcome', { appointment })

      const page = UnableToWorkPage.visit(appointment, formId)

      // And I select a reason
      page.selectSentHomeServiceIssues()

      // And I enter a note 4000 characters long
      page.enterNotesWithCharacterLength(4000)

      // And I check "This information is not to be shared with the person on probation"
      page.checkSensitiveInformation()

      // When I submit the form
      cy.task('stubSaveStatusesForm', { sessionOrAppointment: appointment })
      page.clickSubmit()

      // And I continue from the review page
      const reviewPage = Page.verifyOnPage(ReviewPage)
      reviewPage.clickSubmit()

      // Then I am taken to the confirm unable to work page
      Page.verifyOnPage(ConfirmUnableToWorkPage, appointment)
    })

    //  Scenario: Navigates from confirm unable to work page to session page
    it('navigates from confirm working page to session page', function test() {
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })
      const appointmentStatuses = appointmentSummaries.map(appointmentSummary =>
        appointmentStatusFactory.build({ appointmentId: appointmentSummary.id }),
      )

      // Given I am on the confirm unable to work page
      cy.task('stubFindAppointment', { appointment })
      cy.task('stubGetStatusesForm', {
        sessionOrAppointment: appointment,
        appointmentStatuses: [appointmentStatuses[0]],
      })

      cy.task('stubGetContactOutcomes')

      const page = ConfirmUnableToWorkPage.visit(appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      cy.task('stubGetStatusesForm', { sessionOrAppointment: session, appointmentStatuses })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })
})
