import { Page } from '@playwright/test'
import HomePage from '../pages/homePage'
import { Team } from '../fixtures/testOptions'

export default async (page: Page, team: Team, startDate: Date = new Date()) => {
  const homePage = new HomePage(page)
  await homePage.expect.toBeOnThePage()

  await homePage.teamFilter.selectRegion(team)
  await homePage.teamFilter.selectTeam(team)
  await homePage.completeSearchForm(startDate)
  await homePage.submitForm()
  return homePage
}
