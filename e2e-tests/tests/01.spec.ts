import test from '../test'
import signIn from '../steps/signIn'
import SessionPage from '../pages/sessionPage'

test('View a session details', async ({ page, deliusUser }) => {
  const homePage = await signIn(page, deliusUser)

  await homePage.viewDetailsLinkLocator.click()

  const sessionPage = new SessionPage(page)
  await sessionPage.expect.toBeOnThePage()
  await sessionPage.expect.toShowSessionDetails()
})
