//  Feature: Check Answers
//    As a supervisor
//    I want to check the answers that I've added
//    So that I can review and change incorrect data before submitting

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'
import attendanceDataFactory from '../../../../server/testutils/factories/attendanceDataFactory'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import Page from '../../../pages/page'
import ReviewPage from '../../../pages/appointments/update/reviewPage'
import NotesPage from '../../../pages/appointments/update/notesPage'
import { AppointmentDto } from '../../../../server/@types/shared'
import AttendanceOutcomePage from '../../../pages/appointments/update/attendanceOutcomePage'

//  Scenario: Showing the offender details
//    Given I am on the check answers page for an appointment
//    I can see the offender's CRN on the page

//  Scenario: Validating the review page
//    Given I am on the review (check answers) page for an appointment
//    And I do not select an option for the send alert question
//    Then I see the review page with errors

//  Scenario: Changing the outcome
//    Given I am on the review page
//    And I click to change the attendance outcome
//    Then I see the attendance outcome page
//    With the original selection
//    And I change the selection
//    And I complete the form
//    Then I see the new selection on the review page

context('Review', () => {
  const formId = 'some-form'
  let appointment: AppointmentDto

  beforeEach(() => {
    appointment = appointmentFactory.build({})
    cy.task('reset')
    cy.task('stubSignIn')
    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries: { allocations }, teamCodes: [supervisor.unpaidWorkTeams[0].code] })
    cy.task('stubGetContactOutcomes')

    cy.task('stubGetAppointmentForm', {
      form: appointmentOutcomeFormFactory.build({
        attendanceData: attendanceDataFactory.build(),
        contactOutcomeCode: 'ATTC',
      }),
      formId,
    })
    cy.task('stubSaveAppointmentForm', { formId })

    cy.signIn()

    // Given I am on the notes page for an appointment
    cy.task('stubFindAppointment', { appointment })
    const notesPage = NotesPage.visit(appointment, 'completed', formId)

    // And I submit the notes form
    notesPage.clickSubmit()
  })

  //  Scenario: Showing the offender details
  it('shows the offender details on the page', () => {
    // Then I am taken to the review page
    const page = Page.verifyOnPage(ReviewPage, appointment, 'completed')

    // I should see the offender CRN on the page
    page.shouldShowOffenderDetails(appointment.offender.crn)
  })

  //  Scenario: Validating the review page
  it('validates an alert diary selection is made', () => {
    // Given I am on the review (check answers) page for an appointment
    const reviewPage = Page.verifyOnPage(ReviewPage, appointment, 'completed')

    // And I do not select an option for the send alert question
    // And I click submit
    reviewPage.clickSubmit()

    // Then I see the review page with errors
    reviewPage.shouldShowAlertPractitionerError()
  })

  //  Scenario: Changing the outcome
  it('Allows a supervisor to change the outcome', () => {
    //    Given I am on the review page
    const reviewPage = Page.verifyOnPage(ReviewPage, appointment, 'completed')

    // I see the original outcome selected
    reviewPage.shouldShowCorrectOutcome('Attended - Complied')

    // And I click to change the attendance outcome
    reviewPage.clickChangeOutcome()

    // Then I see the attendance outcome page
    const attendanceOutcomePage = Page.verifyOnPage(AttendanceOutcomePage, appointment, 'completed')
    // With the original selection
    attendanceOutcomePage.checkOptionSelected('ATTC')
    // And I change the selection
    attendanceOutcomePage.completeForm('AFTC')

    cy.task('stubGetAppointmentForm', {
      form: appointmentOutcomeFormFactory.build({
        attendanceData: attendanceDataFactory.build(),
        contactOutcomeCode: 'AFTC',
      }),
      formId,
    })

    attendanceOutcomePage.clickSubmit()

    // And I complete the form
    const notesPage = NotesPage.visit(appointment, 'completed', formId)

    // And I submit the notes form
    notesPage.clickSubmit()

    Page.verifyOnPage(ReviewPage, appointment, 'completed')

    // Then I see the new selection on the review page
    reviewPage.shouldShowCorrectOutcome('Attended - Failed to Comply')
  })
})
