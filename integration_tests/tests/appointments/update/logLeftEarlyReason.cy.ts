//  Feature: Log why a person left early
//    So that I can log on a person's progress on Community Payback
//    As a supervisor
//    I want to confirm why a person has left early
//
//    Scenario: Validates the left early reason form
//      Given I am on the left early reason page
//      And I do not select a reason
//      And I enter a note longer than 4000 characters
//      When I submit the form
//      Then I see the same page with errors
//      And the notes field is populated with the user's input
//
//    Scenario: Confirms the reason the person left early
//      Given I am on the left early reason page
//      And I select a reason
//      And I enter a note 4000 characters long
//      And I check "This information is not to be shared with the person on probation"
//      When I submit the form
//      Then I am taken to the compliance page
//
//    Scenario: Navigates from confirm left early page to session page
//      Given I am on the confirm left early page
//      And I click the return to session link
//      Then I am taken to the session page
//

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentStatusFactory from '../../../../server/testutils/factories/appointmentStatusFactory'
import appointmentSummaryFactory from '../../../../server/testutils/factories/appointmentSummaryFactory'
import sessionFactory from '../../../../server/testutils/factories/sessionFactory'
import LeftEarlyReasonPage from '../../../pages/appointments/update/leftEarlyReasonPage'
import Page from '../../../pages/page'
import SessionPage from '../../../pages/session'
import { AppointmentDto } from '../../../../server/@types/shared'
import { AppointmentStatus } from '../../../../server/services/appointmentStatusService'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import ConfirmLeftEarlyPage from '../../../pages/appointments/update/confirm/confirmLeftEarlyPage'
import CompliancePage from '../../../pages/appointments/update/compliancePage'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'

context('Log left early ', () => {
  const formId = 'some-form'

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
    cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build(), formId })

    cy.signIn()
  })

  //  Scenario: validates form
  it('validates the form', function test() {
    // Given I am on the left early page
    cy.task('stubGetContactOutcomes')

    const page = LeftEarlyReasonPage.visit(appointment, formId)

    // And I do not select a reason

    // And I enter a note longer than 4000 characters
    page.enterNotesWithCharacterLength(4001)

    // When I submit the form
    page.clickSubmit()

    // Then I see the same page with errors
    Page.verifyOnPage(LeftEarlyReasonPage, appointment)
    page.shouldShowErrorSummary('leftEarlyReason', 'Select why they cannot continue this session')
    page.shouldShowErrorSummary('notes', 'Notes must be 4000 characters or less')

    // And the notes field is populated with the user's input
    page.shouldShowSubmittedNotes()
  })

  // Scenario: Confirms the reason the person left early
  it('submits form and navigates to confirm left early page', function test() {
    // Given I am on the left early page
    cy.task('stubGetContactOutcomes')
    cy.task('stubUpdateAppointmentOutcome', { appointment })

    const page = LeftEarlyReasonPage.visit(appointment, formId)

    // And I select a reason
    page.selectSentHomeServiceIssues()

    // And I enter a note 4000 characters long
    page.enterNotesWithCharacterLength(4000)

    // And I check "This information is not to be shared with the person on probation"
    page.checkSensitiveInformation()

    // When I submit the form
    cy.task('stubSaveAppointmentForm', { formId })

    page.clickSubmit()

    // Then I am taken to the compliance page
    Page.verifyOnPage(CompliancePage, appointment)
  })

  //  Scenario: Navigates from confirm left early page to session page
  it('navigates from confirm working page to session page', function test() {
    const appointmentSummaries = appointmentSummaryFactory.buildList(3)
    const session = sessionFactory.build({ appointmentSummaries })
    appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })
    const appointmentStatuses = appointmentSummaries.map(appointmentSummary =>
      appointmentStatusFactory.build({ appointmentId: appointmentSummary.id }),
    )

    // Given I am on the confirm left early page
    cy.task('stubFindAppointment', { appointment })
    cy.task('stubGetStatusesForm', { sessionOrAppointment: appointment, appointmentStatuses: [appointmentStatuses[0]] })

    cy.task('stubGetContactOutcomes')

    const page = ConfirmLeftEarlyPage.visit(appointment)

    // And I click the return to session link
    cy.task('stubFindSession', { session })
    cy.task('stubGetStatusesForm', { sessionOrAppointment: session, appointmentStatuses })
    page.clickLinkToSessionPage()

    // Then I am taken to the session page
    Page.verifyOnPage(SessionPage, session)
  })
})
