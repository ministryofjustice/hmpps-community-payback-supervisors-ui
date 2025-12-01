import { Page } from '@playwright/test'
import HomePage from '../pages/homePage'
import SessionPage from '../pages/sessionPage'

export default async (page: Page): Promise<void> => {
  const homePage = new HomePage(page)
  await homePage.viewDetailsLinkLocator.click()
  const sessionPage = new SessionPage(page)
  await sessionPage.clearSessionDataLinkLocator.click()
  await page.getByRole('button', { name: 'Clear the data' }).click()
  await sessionPage.clickBack()
  await homePage.expect.toBeOnThePage()
}
