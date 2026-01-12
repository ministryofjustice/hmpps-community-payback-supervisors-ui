import { login as deliusLogin } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import { checkAppointmentOnDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/upw/checkAppointmentDetails'
import test from '../fixtures/appointmentTest'
import signIn from '../steps/signIn'
import clearSessionData from '../steps/clearSessionData'
import recordArrivalAbleToWork from '../steps/recordArrivalAbleToWork'
import AppointmentPage from '../pages/appointmentPage'
import EndTimePage from '../pages/appointments/update/endTimePage'
import CompliancePage from '../pages/appointments/update/compliancePage'
import ConfirmCompletedPage from '../pages/appointments/update/confirm/confirmCompletedPage'

test('Record an appointment which starts and finishes on time', async ({ page, supervisorUser, testData, team }) => {
  const { person, project } = testData
  await signIn(page, supervisorUser)
  await clearSessionData(page, project)

  // record arrival able to work
  const sessionPage = await recordArrivalAbleToWork(page, testData, person.getFullName())

  // record finished on time
  await sessionPage.clickOnAnAppointmentForPerson(person.getFullName())
  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.clickFinishSession()

  const endTimePage = new EndTimePage(page, 'completed')
  await endTimePage.expect.toBeOnThePage()
  await endTimePage.clickContinue()

  const compliancePage = new CompliancePage(page)
  await compliancePage.enterComplianceDetails()
  await compliancePage.clickContinue()

  const confirmCompletedPage = new ConfirmCompletedPage(page)
  await confirmCompletedPage.expect.toBeOnThePage()

  await confirmCompletedPage.clickLinkToSessionPage()
  await sessionPage.expect.toBeOnThePage()

  await sessionPage.expect.appointmentToHaveStatus(person.getFullName(), 'Session complete')

  await deliusLogin(page)
  await page.getByRole('link', { name: 'UPW Project Diary' }).click()
  await page.waitForSelector('span.float-start:has-text("UPW Project Diary")')
  await checkAppointmentOnDelius(page, {
    teamProvider: team.provider,
    teamName: team.name,
    projectName: testData.project.name,
    popCrn: person.crn,
    popName: person.getDisplayName(),
    startTime: '09:00',
    endTime: '17:00',
    outcome: 'Attended - Complied',
  })
})
