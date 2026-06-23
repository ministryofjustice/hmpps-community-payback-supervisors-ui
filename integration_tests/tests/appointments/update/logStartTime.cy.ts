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
//    Scenario: Navigates from review page to confirm absent page to session page
//      Given I am on the notes page
//      And I navigate to the review page
//      And I navigate through the review page
//      When I am on the confirm page
//      And I click the return to session link
//      Then I am taken to the session page

import appointmentFactory from '../../../../server/testutils/factories/appointmentFactory'
import appointmentSummaryFactory from '../../../../server/testutils/factories/appointmentSummaryFactory'
import sessionFactory from '../../../../server/testutils/factories/sessionFactory'
import ConfirmAbsentPage from '../../../pages/appointments/update/confirm/confirmAbsentPage'
import StartTimePage from '../../../pages/appointments/update/startTimePage'
import Page from '../../../pages/page'
import SessionPage from '../../../pages/session'
import { AppointmentDto } from '../../../../server/@types/shared'
import sessionSummaryFactory from '../../../../server/testutils/factories/sessionSummaryFactory'
import supervisorFactory from '../../../../server/testutils/factories/supervisorFactory'
import appointmentOutcomeFormFactory from '../../../../server/testutils/factories/appointmentOutcomeFormFactory'
import ReviewPage from '../../../pages/appointments/update/reviewPage'
import EndTimePage from '../../../pages/appointments/update/endTimePage'
import NotesPage from '../../../pages/appointments/update/notesPage'
import {
  contactOutcomeFactory,
  contactOutcomesFactory,
} from '../../../../server/testutils/factories/contactOutcomeFactory'

context('Log start time ', () => {
  let appointment: AppointmentDto

  beforeEach(() => {
    appointment = appointmentFactory.build()
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

  //  Scenario: Arrived
  describe('arrived', () => {
    //  Scenario: Validates time entered
    it('validates the time entered on submit', () => {
      // Given I am on the start time page for an arrival form
      const page = StartTimePage.visit(appointment, 'arrived')

      // When I submit an invalid time
      page.clearTime()
      page.clickSubmit()

      // Then I see the same page with errors
      Page.verifyOnPage(StartTimePage, appointment, 'arrived')
      page.shouldShowValidationErrors()
      page.shouldHaveTimeValue('')
    })

    //  Scenario: Submitting a valid time
    it('submits start time and navigates to next page', () => {
      // Given I am on the start time page for an arrival form
      const page = StartTimePage.visit(appointment, 'arrived')

      // When I submit a valid time
      cy.task('stubUpdateAppointmentOutcome', { appointment })
      page.enterTime('09:30')
      page.clickSubmit()

      // Then I see the next form page
      Page.verifyOnPage(EndTimePage, appointment, 'completed')
    })
  })

  //  Scenario: Absent
  describe('absent', () => {
    //  Scenario: Navigates from confirm absent page to session page
    it('navigates from confirm absent page to session page', () => {
      const appointmentSummaries = appointmentSummaryFactory.buildList(3)
      const session = sessionFactory.build({ appointmentSummaries })
      appointment = appointmentFactory.build({ projectCode: session.projectCode, date: session.date })

      cy.task('stubFindAppointment', { appointment })
      cy.task('stubUpdateAppointmentOutcome', { appointment })

      const form = appointmentOutcomeFormFactory.build()
      cy.task('stubGetAppointmentForm', { form, formId: 'some-form' })

      cy.task('stubSaveAppointmentForm', { formId: 'some-form' })

      // Given I am on the notes page
      const notesPage = NotesPage.visit(appointment, 'absent')

      // And I navigate to the review page
      notesPage.clickSubmit()

      // And I navigate through the review page
      const reviewPage = Page.verifyOnPage(ReviewPage, appointment, 'absent')
      reviewPage.clickSubmit()

      // When I am on the confirm page
      const page = Page.verifyOnPage(ConfirmAbsentPage, appointment)

      // And I click the return to session link
      cy.task('stubFindSession', { session })
      page.clickLinkToSessionPage()

      // Then I am taken to the session page
      Page.verifyOnPage(SessionPage, session)
    })
  })
})
