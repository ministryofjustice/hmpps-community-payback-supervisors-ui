import test from '../test'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import StartTimePage from '../pages/appointments/update/startTimePage'
import IsAbleToWorkPage from '../pages/appointments/update/isAbleToWorkPage'
import UnableToWorkPage from '../pages/appointments/update/unableToWorkPage'
import ConfirmUnableToWorkPage from '../pages/appointments/update/confirm/confirmUnableToWorkPage'
import clearSessionData from '../steps/clearSessionData'
import { readDeliusData } from '../delius/deliusTestData'
import PersonOnProbation from '../delius/personOnProbation'

test.skip('Record an arrival and log as unable to work', async ({ page, supervisorUser }) => {
  const deliusTestData = await readDeliusData()
  const person = deliusTestData.pops[1] as PersonOnProbation
  const homePage = await signIn(page, supervisorUser)
  await clearSessionData(page, deliusTestData)

  await homePage.clickViewDetailsForProject(deliusTestData.project.name)

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails(deliusTestData)
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
})
