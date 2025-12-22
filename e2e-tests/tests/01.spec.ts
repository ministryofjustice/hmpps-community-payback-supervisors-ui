import test from '../test'
import signIn from '../steps/signIn'
import clearSessionData from '../steps/clearSessionData'
import recordArrivalAbleToWork from '../steps/recordArrivalAbleToWork'
import AppointmentPage from '../pages/appointmentPage'
import EndTimePage from '../pages/appointments/update/endTimePage'
import CompliancePage from '../pages/appointments/update/compliancePage'
import ConfirmCompletedPage from '../pages/appointments/update/confirm/confirmCompletedPage'
import { readDeliusData } from '../delius/deliusTestData'
import PersonOnProbation from '../delius/personOnProbation'

test('Record an appointment which starts and finishes on time', async ({ page, supervisorUser }) => {
  const index = test.info().parallelIndex
  const deliusTestData = await readDeliusData()
  const person = deliusTestData.pops[index] as PersonOnProbation
  await signIn(page, supervisorUser)
  await clearSessionData(page, deliusTestData)

  // record arrival able to work
  const sessionPage = await recordArrivalAbleToWork(page, deliusTestData, person.getFullName())

  // record finished on time
  await sessionPage.clickOnAnAppointmentForPerson(person.getFullName())
  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.clickFinishSession()

  const endTimePage = new EndTimePage(page, 'completed')
  await endTimePage.expect.toBeOnThePage()
  await endTimePage.clickContinue()

  const compliancePage = new CompliancePage(page)
  await compliancePage.enterComplianceDetails()
  await compliancePage.clickContinue()

  const confirmCompletedPage = new ConfirmCompletedPage(page)
  await confirmCompletedPage.expect.toBeOnThePage()

  await confirmCompletedPage.clickLinkToSessionPage()
  await sessionPage.expect.toBeOnThePage()

  await sessionPage.expect.appointmentToHaveStatus(person.getFullName(), 'Session complete')
})
