import test from '../test'
import signIn from '../steps/signIn'

test('displays homepage', async ({ page, deliusUser }) => {
  await signIn(page, deliusUser)
})
