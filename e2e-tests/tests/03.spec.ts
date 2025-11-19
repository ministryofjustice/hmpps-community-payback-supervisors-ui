import test from '../test'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'

test('Record an absence', async ({ page, deliusUser }) => {
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

  await appointmentPage.clickNotArrived()

  const startTimePage = new StartTimePage(page, 'absent')
  await startTimePage.expect.toBeOnThePage()
  await startTimePage.enterAStartTime()
  await startTimePage.clickContinue()

  await startTimePage.expect.toBeOnThePage()
})
