import { Page } from '@playwright/test'
import SessionPage from '../pages/sessionPage'
import HomePage from '../pages/homePage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import IsAbleToWorkPage from '../pages/appointments/update/isAbleToWorkPage'
import ConfirmWorkingPage from '../pages/appointments/update/confirm/confirmWorkingPage'

export default async (page: Page, selectedAppointment: number): Promise<SessionPage> => {
  const homePage = new HomePage(page)
  await homePage.viewDetailsLinkLocator.click()

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.clickOnAppointment(selectedAppointment)

  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.expect.toBeOnThePage()
  await appointmentPage.clickArrived()

  const startTimePage = new StartTimePage(page, 'arrived')
  await startTimePage.expect.toBeOnThePage()
  await startTimePage.enterAStartTime()
  await startTimePage.clickContinue()

  const isAbleToWorkPage = new IsAbleToWorkPage(page)
  await isAbleToWorkPage.expect.toBeOnThePage()
  await isAbleToWorkPage.checkYes()
  await isAbleToWorkPage.clickContinue()

  const confirmWorkingPage = new ConfirmWorkingPage(page)
  await confirmWorkingPage.expect.toBeOnThePage()
  await confirmWorkingPage.clickLinkToSessionPage()

  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.appointmentToHaveStatus(selectedAppointment, 'Working')
  return sessionPage
}
