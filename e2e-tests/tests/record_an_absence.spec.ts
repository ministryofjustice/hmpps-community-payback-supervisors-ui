import { checkAppointmentOnDelius } from '../steps/delius'
import test from '../fixtures/appointmentTest'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'
import AppointmentPage from '../pages/appointmentPage'
import ConfirmAbsentPage from '../pages/appointments/update/confirm/confirmAbsentPage'
import ReviewPage from '../pages/appointments/update/reviewPage'
import NotesPage from '../pages/appointments/update/notesPage'

test('Record an absence', async ({ page, supervisorUser, testData, team }) => {
  const { person, project } = testData
  const homePage = await signIn(page, supervisorUser)

  await homePage.clickViewDetailsForProject(project.name)

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails(testData)
  await sessionPage.clickOnAnAppointmentForPerson(person.getFullName())

  const appointmentPage = new AppointmentPage(page)
  await appointmentPage.expect.toBeOnThePage()

  await appointmentPage.clickNotArrived()

  const notesPage = new NotesPage(page)
  await notesPage.expect.toBeOnThePage()
  await notesPage.completeForm()
  await notesPage.clickContinue()

  const reviewPage = new ReviewPage(page)
  await reviewPage.expect.toBeOnThePage()
  await reviewPage.selectAlertPractitioner()
  await reviewPage.clickContinue()

  const confirmAbsentPage = new ConfirmAbsentPage(page)
  await confirmAbsentPage.expect.toBeOnThePage()

  await confirmAbsentPage.clickLinkToSessionPage()

  await sessionPage.expect.toBeOnThePage()

  await sessionPage.expect.appointmentToHaveStatus(person.getFullName(), 'Unacceptable Absence')

  await checkAppointmentOnDelius(page, team, testData, { outcome: 'Unacceptable Absence (CP Only)' })
})
