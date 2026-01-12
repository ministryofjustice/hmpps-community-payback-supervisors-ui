import { login as deliusLogin } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import { checkAppointmentOnDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/upw/checkAppointmentDetails'
import test from '../fixtures/appointmentTest'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import ConfirmAbsentPage from '../pages/appointments/update/confirm/confirmAbsentPage'
import clearSessionData from '../steps/clearSessionData'

test('Record an absence', async ({ page, supervisorUser, testData, team }) => {
  const { person, project } = testData
  const homePage = await signIn(page, supervisorUser)
  await clearSessionData(page, project)

  await homePage.clickViewDetailsForProject(project.name)

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails(testData)
  await sessionPage.clickOnAnAppointmentForPerson(person.getFullName())

  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.expect.toBeOnThePage()

  await appointmentPage.clickNotArrived()

  const startTimePage = new StartTimePage(page, 'absent')
  await startTimePage.expect.toBeOnThePage()
  await startTimePage.enterAStartTime()
  await startTimePage.clickContinue()

  const confirmAbsentPage = new ConfirmAbsentPage(page)
  await confirmAbsentPage.expect.toBeOnThePage()

  await confirmAbsentPage.clickLinkToSessionPage()

  await sessionPage.expect.toBeOnThePage()

  await sessionPage.expect.appointmentToHaveStatus(person.getFullName(), 'Absent')

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
    outcome: 'Unacceptable Absence',
  })
})
