import test from '../test'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'

test('View a person details', async ({ page, deliusUser }) => {
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
})
