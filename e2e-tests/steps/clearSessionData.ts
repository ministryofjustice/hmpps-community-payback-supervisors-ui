import { Page } from '@playwright/test'
import HomePage from '../pages/homePage'
import SessionPage from '../pages/sessionPage'
import Project from '../delius/project'

export default async (page: Page, project: Project): Promise<void> => {
  const homePage = new HomePage(page)
  await homePage.clickViewDetailsForProject(project.name)
  const sessionPage = new SessionPage(page)
  await sessionPage.clearSessionDataLinkLocator.click()
  await page.getByRole('button', { name: 'Clear the data' }).click()
  await sessionPage.clickBack()
  await homePage.expect.toBeOnThePage()
}
