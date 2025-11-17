import test from '../test'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import AbleToWorkPage from '../pages/appointments/update/ableToWorkPage'

test('Record an arrival', async ({ page, deliusUser }) => {
  const homePage = await signIn(page, deliusUser)

  await homePage.viewDetailsLinkLocator.click()

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails()
  await sessionPage.clickOnAnAppointment()

  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.expect.toBeOnThePage()
  await appointmentPage.expect.toShowAppointmentDetails()
  await appointmentPage.expect.toShowOffenderDetails()

  await appointmentPage.clickArrived()

  const startTimePage = new StartTimePage(page)
  await startTimePage.expect.toBeOnThePage()
  await startTimePage.enterAStartTime()
  await startTimePage.clickContinue()

  const ableToWorkPage = new AbleToWorkPage(page)
  await ableToWorkPage.expect.toBeOnThePage()
})
