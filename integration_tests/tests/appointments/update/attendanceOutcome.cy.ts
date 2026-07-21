//  Feature: Update attendance outcome
//    As a supervisor
//    I want to update the attendance outcome on for an offender
//    So that I can track progress for an unpaid work order

//  Scenario: Validating the attendance outcome page
//    Given I am on the attendance outcome page for an appointment
//    And I do not select an outcome
//    And I enter notes
//    When I submit the form
//    Then I see the attendance outcome page with errors

//  Scenario: Completing the attendance outcome page (attended)
//    Given I am on the attendance outcome page for an appointment
//    And I complete the form with an attended outcome
//    When I submit the form
//    Then I see the log time page

import AttendanceOutcomePage from '../../../pages/appointments/update/attendanceOutcomePage'
import Page from '../../../pages/page'
import {
  contactOutcomeFactory,
  contactOutcomesFactory,
} from '../../../../server/testutils/factories/contactOutcomeFactory'
import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import { AppointmentDto } from '../../../../server/@types/shared'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'
import StartTimePage from '../../../pages/appointments/update/startTimePage'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'

context('Attendance outcome', () => {
  let appointment: AppointmentDto

  beforeEach(() => {
    appointment = appointmentFactory.build()

    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubFindAppointment', { appointment })
    const supervisor = supervisorFactory.build()
    const allocations = [sessionSummaryFactory.build({ date: '2025-09-15' })]
    cy.task('stubFindSupervisor', { supervisor })
    cy.task('stubNextSessions', { sessionSummaries: { allocations }, teamCodes: [supervisor.unpaidWorkTeams[0].code] })

    const attendedOutcome = contactOutcomeFactory.build({ code: 'ATTC' })
    const contactOutcomes = contactOutcomesFactory.build({ contactOutcomes: [attendedOutcome] })
    cy.wrap(contactOutcomes).as('contactOutcomes')

    cy.signIn()
  })

  beforeEach(function test() {
    cy.task('stubGetContactOutcomes', { contactOutcomes: this.contactOutcomes })
    cy.task('stubGetAppointmentForm', appointmentOutcomeFormFactory.build())
  })

  // Scenario: Validating the attendance outcome page
  it('validates form data', function test() {
    // Given I am on the attendance outcome page for an appointment
    const page = AttendanceOutcomePage.visit(appointment)

    // And I do not select an outcome
    page.contactOutcomeOptions.shouldBeVisible()

    // When I submit the form
    page.clickSubmit()

    // Then I see the attendance outcome page with errors
    page.shouldShowErrorSummary('attendanceOutcome', 'Select an attendance outcome')
    page.contactOutcomeOptions.shouldNotHaveASelectedValue()
  })

  // Scenario: Completing the attendance outcome page (attended)
  it('submits the form and navigates to the next page', function test() {
    // Given I am on the attendance outcome page for an appointment
    const page = AttendanceOutcomePage.visit(appointment)

    // And I complete the form with an attended outcome
    page.completeForm(this.contactOutcomes.contactOutcomes[0].code)

    cy.task('stubSaveAppointmentForm')
    // When I submit the form
    page.clickSubmit()

    // Then I see the log time page
    Page.verifyOnPage(StartTimePage, appointment, 'arrived')
  })
})
