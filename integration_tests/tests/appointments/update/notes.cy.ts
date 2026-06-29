// Feature: Update notes
//   As a supervisor
//   I want to update the notes on for an offender
//   So that I can track progress for an unpaid work order
//
// Scenario: Validating the notes page
//   Given I am on the notes page
//   And I enter a note which is too long
//   When I submit the form
//   Then I see the notes page with errors
//
// Scenario: Completing the notes page with no note
//   Given I am on the notes page
//   And I submit the empty form
//   Then I am taken to the review page
//
// Scenario: saving a note
//   Given I am on the notes page
//   And I enter a note
//   Then I am taken to the review page
//   And I can see the note text
//
// Scenario: setting the note to be sensitive
//   Given I am on the notes page
//   And I check the sensitive info checkbox
//   And I submit the form
//   Then I am taken to the review page
//   And I can see that the sensitive info should not be shared

// Scenario: already sensitive appointments are flagged as sensitive
//   Given I am on the notes page
//   And I cannot see the sensitive info checkbox
//   And I submit the form
//   Then I am taken to the review page
//   And I can see that the sensitive info should not be shared

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import Page from '../../../pages/page'
import { AppointmentDto } from '../../../../server/@types/shared'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'
import ReviewPage from '../../../pages/appointments/update/reviewPage'
import NotesPage from '../../../pages/appointments/update/notesPage'
import {
  contactOutcomeFactory,
  contactOutcomesFactory,
} from '../../../../server/testutils/factories/contactOutcomeFactory'

context('Notes', () => {
  let appointment: AppointmentDto

  beforeEach(() => {
    appointment = appointmentFactory.build({ sensitive: false })
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubFindAppointment', { appointment })
    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries: { allocations }, supervisorTeam: supervisor.unpaidWorkTeams[0] })
    cy.task('stubSaveAppointmentForm')
    cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build() })

    const contactOutcomes = contactOutcomesFactory.build({
      contactOutcomes: [contactOutcomeFactory.build({ enforceable: true }), contactOutcomeFactory.build()],
    })
    cy.task('stubGetContactOutcomes', { contactOutcomes })

    cy.signIn()
  })

  // Scenario: Validating the notes page
  it('validates form data', () => {
    const form = appointmentOutcomeFormFactory.build()
    cy.task('stubGetAppointmentForm', { form, formId: 'some-form' })

    cy.task('stubSaveAppointmentForm', { formId: 'some-form' })

    // Given I am on the notes page
    const notesPage = NotesPage.visit(appointment, 'absent')

    // And I enter a note which is too long
    notesPage.enterNotesWithCharacterLength(4005)

    // When I submit the form
    notesPage.clickSubmit()

    // Then I see the notes page with errors
    notesPage.shouldShowErrorSummary('notes', 'Notes must be 4000 characters or less')
  })

  // Scenario: Completing the notes page with no note
  it('submits the form and navigates to the next page with no note', function test() {
    const form = appointmentOutcomeFormFactory.build()
    cy.task('stubGetAppointmentForm', { form, formId: 'some-form' })

    cy.task('stubSaveAppointmentForm', { formId: 'some-form' })

    // Given I am on the notes page
    const notesPage = NotesPage.visit(appointment, 'absent')

    // And I submit the empty form
    notesPage.clickSubmit()

    // Then I am taken to the review page
    Page.verifyOnPage(ReviewPage, appointment, 'absent')
  })

  // Scenario: saving a note
  it('submits the form and navigates to the next page with a note', function test() {
    const form = appointmentOutcomeFormFactory.build()
    cy.task('stubGetAppointmentForm', { form, formId: 'some-form' })

    cy.task('stubSaveAppointmentForm', { formId: 'some-form' })

    // Given I am on the notes page
    const notesPage = NotesPage.visit(appointment, 'absent')

    // And I enter a note
    notesPage.enterNote('note')
    notesPage.clickSubmit()

    // Then I am taken to the review page
    const reviewPage = Page.verifyOnPage(ReviewPage, appointment, 'absent')

    // And I can see the note text
    reviewPage.shouldContainNote('note')
  })

  // Scenario: setting the note to be sensitive
  it('submits the form and navigates to the next page with sensitive set to true', function test() {
    const form = appointmentOutcomeFormFactory.build()
    cy.task('stubGetAppointmentForm', { form, formId: 'some-form' })

    cy.task('stubSaveAppointmentForm', { formId: 'some-form' })

    // Given I am on the notes page
    const notesPage = NotesPage.visit(appointment, 'absent')
    notesPage.enterNote('note')
    // And I check the sensitive info checkbox
    notesPage.checkSensitiveInformation()
    // And I submit the form
    notesPage.clickSubmit()

    // Then I am taken to the review page
    const reviewPage = Page.verifyOnPage(ReviewPage, appointment, 'absent')
    reviewPage.shouldContainNote('note')

    // And I can see that the sensitive info should not be shared
    reviewPage.cannotBeShared()
  })

  // Scenario: already sensitive appointments are flagged as sensitive
  it('submits the form and navigates to the next page with sensitive set to true', function test() {
    appointment = appointmentFactory.build({ sensitive: true })
    cy.task('stubFindAppointment', { appointment })

    const form = appointmentOutcomeFormFactory.build()
    cy.task('stubGetAppointmentForm', { form, formId: 'some-form' })

    cy.task('stubSaveAppointmentForm', { formId: 'some-form' })

    // Given I am on the notes page
    const notesPage = NotesPage.visit(appointment, 'absent')
    notesPage.enterNote('note')
    // And I cannot see the sensitive info checkbox
    notesPage.shouldNotShowSensitiveInformationCheckBox()
    // And I submit the form
    notesPage.clickSubmit()

    // Then I am taken to the review page
    const reviewPage = Page.verifyOnPage(ReviewPage, appointment, 'absent')
    reviewPage.shouldContainNote('note')

    // And I can see that the sensitive info should not be shared
    reviewPage.cannotBeShared()
  })
})
