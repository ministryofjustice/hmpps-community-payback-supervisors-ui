//  Feature: Update attendance outcome
//    As a supervisor
//    I want to update the attendance outcome on for an offender
//    So that I can track progress for an unpaid work order

//  Scenario: Showing the offender details
//    Given I am on the attendance outcome page for an appointment
//    I can see the offender's CRN on the page

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

//  Scenario: limited access offender
//    Given the offender is limited
//    And I view the attendance outcome page
//    Then I should see the restricted person page

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
import providerSummaryFactory from '../../../../server/testutils/factories/providerSummaryFactory'
import providerTeamSummaryFactory from '../../../../server/testutils/factories/providerTeamSummaryFactory'
import Utils from '../../../utils'
import offenderLimitedFactory from '../../../../server/testutils/factories/offenderLimitedFactory'
import RestrictedPersonPage from '../../../pages/restrictedPersonPage'
import caseDetailsFactory from '../../../../server/testutils/factories/caseDetailsFactory'

context('Attendance outcome', () => {
  let appointment: AppointmentDto

  beforeEach(() => {
    appointment = appointmentFactory.build()

    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubFindAppointment', { appointment })
    const providers = providerSummaryFactory.buildList(2)
    const provider = providers[0]
    const teams = providerTeamSummaryFactory.buildList(2)
    cy.task('stubGetProviders', { providers: { providers } })
    cy.task('stubGetTeams', { teams: { providers: teams }, providerCode: provider.code })
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
    cy.task('stubGetAppointmentForm', { form: appointmentOutcomeFormFactory.build() })

    Utils.stubOffenderFromAppointment(appointment)
  })

  //  Scenario: Showing the offender details
  it('shows the offender details on the page', () => {
    // Given I am on the attendance outcome page for an appointment
    cy.task('stubFindAppointment', { appointment })
    const page = AttendanceOutcomePage.visit(appointment)
    // I should see the offender CRN on the page
    page.shouldShowOffenderDetails(appointment.offender)
  })

  // Scenario: Validating the attendance outcome page
  it('validates form data', function test() {
    // Given I am on the attendance outcome page for an appointment
    const page = AttendanceOutcomePage.visit(appointment)

    // And I do not select an outcome
    page.contactOutcomeOptions.shouldBeVisible()

    // When I submit the form
    page.clickContinue()

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
    page.clickContinue()

    // Then I see the log time page
    Page.verifyOnPage(StartTimePage, appointment, 'arrived')
  })

  // Scenario: limited access offender
  it('shows the restricted person page for an LAO', function test() {
    // Given the offender is limited
    const limitedOffender = offenderLimitedFactory.build()

    const limitedAppointment = appointmentFactory.build({
      offender: limitedOffender,
    })
    cy.task('stubFindAppointment', { appointment: limitedAppointment })

    const caseDetailsSummary = caseDetailsFactory.build({
      offender: limitedAppointment.offender,
      unpaidWorkDetails: undefined,
    })
    cy.task('stubGetOffenderSummary', { caseDetailsSummary })

    // And I view the attendance outcome page
    AttendanceOutcomePage.visit(limitedAppointment)

    // Then I should see the restricted person page
    Page.verifyOnPage(RestrictedPersonPage, limitedOffender.crn)
  })
})
