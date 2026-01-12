import { login as deliusLogin } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import { checkAppointmentOnDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/upw/checkAppointmentDetails'
import test from '../fixtures/appointmentTest'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import IsAbleToWorkPage from '../pages/appointments/update/isAbleToWorkPage'
import UnableToWorkPage from '../pages/appointments/update/unableToWorkPage'
import ConfirmUnableToWorkPage from '../pages/appointments/update/confirm/confirmUnableToWorkPage'
import clearSessionData from '../steps/clearSessionData'

test('Record an arrival and log as unable to work', async ({ page, supervisorUser, testData, team }) => {
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

  await appointmentPage.clickArrived()

  const startTimePage = new StartTimePage(page, 'arrived')
  await startTimePage.expect.toBeOnThePage()
  await startTimePage.enterAStartTime()
  await startTimePage.clickContinue()

  const isAbleToWorkPage = new IsAbleToWorkPage(page)
  await isAbleToWorkPage.expect.toBeOnThePage()
  await isAbleToWorkPage.checkNo()
  await isAbleToWorkPage.clickContinue()

  const unableToWorkPage = new UnableToWorkPage(page)
  await unableToWorkPage.expect.toBeOnThePage()
  await unableToWorkPage.checkAttendedFailedToComply()
  await unableToWorkPage.enterNotes()
  await unableToWorkPage.checkIsSensitive()
  await unableToWorkPage.clickContinue()

  const confirmUnableToWorkPage = new ConfirmUnableToWorkPage(page)
  await confirmUnableToWorkPage.expect.toBeOnThePage()
  await confirmUnableToWorkPage.clickLinkToSessionPage()

  await sessionPage.expect.toBeOnThePage()

  await sessionPage.expect.appointmentToHaveStatus(person.getFullName(), 'Cannot work')

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
    outcome: 'Attended - Failed to Comply',
  })
})
