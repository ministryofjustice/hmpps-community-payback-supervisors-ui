import { checkAppointmentOnDelius } from '../steps/delius'
import test from '../fixtures/appointmentTest'
import signIn from '../steps/signIn'
import clearSessionData from '../steps/clearSessionData'
import AppointmentPage from '../pages/appointmentPage'
import EndTimePage from '../pages/appointments/update/endTimePage'
import CompliancePage from '../pages/appointments/update/compliancePage'
import ConfirmCompletedPage from '../pages/appointments/update/confirm/confirmCompletedPage'
import ReviewPage from '../pages/appointments/update/reviewPage'
import HomePage from '../pages/homePage'
import SessionPage from '../pages/sessionPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import IsAbleToWorkPage from '../pages/appointments/update/isAbleToWorkPage'

test('Record an appointment as arrived and able to work', async ({ page, supervisorUser, testData, team }) => {
  const { person, project } = testData
  await signIn(page, supervisorUser)
  await clearSessionData(page, project)

  const homePage = new HomePage(page)
  await homePage.clickViewDetailsForProject(testData.project.name)

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails(testData)
  await sessionPage.clickOnAnAppointmentForPerson(person.getFullName())

  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.expect.toBeOnThePage()
  await appointmentPage.clickArrived()

  const startTimePage = new StartTimePage(page, 'arrived')
  await startTimePage.expect.toBeOnThePage()
  await startTimePage.clickContinue()

  const isAbleToWorkPage = new IsAbleToWorkPage(page)
  await isAbleToWorkPage.expect.toBeOnThePage()
  await isAbleToWorkPage.checkYes()
  await isAbleToWorkPage.clickContinue()

  const endTimePage = new EndTimePage(page, 'completed')
  await endTimePage.expect.toBeOnThePage()
  await endTimePage.clickContinue()

  const compliancePage = new CompliancePage(page)
  await compliancePage.enterComplianceDetails()
  await compliancePage.clickContinue()

  const reviewPage = new ReviewPage(page)
  await reviewPage.expect.toBeOnThePage()
  await reviewPage.clickContinue()

  const confirmCompletedPage = new ConfirmCompletedPage(page)
  await confirmCompletedPage.expect.toBeOnThePage()

  await confirmCompletedPage.clickLinkToSessionPage()
  await sessionPage.expect.toBeOnThePage()

  await sessionPage.expect.appointmentToHaveStatus(person.getFullName(), 'Session complete')

  await checkAppointmentOnDelius(page, team, testData, { outcome: 'Attended - Complied' })
})
