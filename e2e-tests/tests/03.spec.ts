import test from '../fixtures/test'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import ConfirmAbsentPage from '../pages/appointments/update/confirm/confirmAbsentPage'
import clearSessionData from '../steps/clearSessionData'
import { readDeliusData } from '../delius/deliusTestData'
import PersonOnProbation from '../delius/personOnProbation'

test('Record an absence', async ({ page, supervisorUser }) => {
  const index = test.info().parallelIndex
  const deliusTestData = await readDeliusData()
  const person = deliusTestData.pops[index] as PersonOnProbation
  const homePage = await signIn(page, supervisorUser)
  await clearSessionData(page, deliusTestData)

  await homePage.clickViewDetailsForProject(deliusTestData.project.name)

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails(deliusTestData)
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
})
