import test from '../test'
import signIn from '../steps/signIn'
import clearSessionData from '../steps/clearSessionData'
import recordArrivalAbleToWork from '../steps/recordArrivalAbleToWork'
import AppointmentPage from '../pages/appointmentPage'
import EndTimePage from '../pages/appointments/update/endTimePage'
import CompliancePage from '../pages/appointments/update/compliancePage'
import LeftEarlyReasonPage from '../pages/appointments/update/leftEarlyReasonPage'
import ConfirmLeftEarlyPage from '../pages/appointments/update/confirm/confirmLeftEarlyPage'

test('Record an appointment which starts on time but finishes early', async ({ page, deliusUser }) => {
  await signIn(page, deliusUser)
  await clearSessionData(page)

  // record arrival able to work
  const sessionPage = await recordArrivalAbleToWork(page)

  // record left early
  await sessionPage.clickOnAnAppointment()
  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.clickLeftSiteEarly()

  const endTimePage = new EndTimePage(page, 'leftEarly')
  await endTimePage.expect.toBeOnThePage()
  await endTimePage.clickContinue()

  const leftEarlyReasonPage = new LeftEarlyReasonPage(page)
  await leftEarlyReasonPage.checkAttendedFailedToComply()
  await leftEarlyReasonPage.enterNotes()
  await leftEarlyReasonPage.checkIsSensitive()
  await leftEarlyReasonPage.clickContinue()

  const compliancePage = new CompliancePage(page)
  await compliancePage.enterComplianceDetails()
  await compliancePage.clickContinue()

  const confirmCompletedPage = new ConfirmLeftEarlyPage(page)
  await confirmCompletedPage.expect.toBeOnThePage()

  await confirmCompletedPage.clickLinkToSessionPage()
  await sessionPage.expect.toBeOnThePage()
})
