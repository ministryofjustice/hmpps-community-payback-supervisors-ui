import test from '../test'
import signIn from '../steps/signIn'
import clearSessionData from '../steps/clearSessionData'
import recordArrivalAbleToWork from '../steps/recordArrivalAbleToWork'

test('Record an appointment which starts and finishes on time', async ({ page, deliusUser }) => {
  await signIn(page, deliusUser)
  await clearSessionData(page)

  // record arrival able to work
  await recordArrivalAbleToWork(page)
})
