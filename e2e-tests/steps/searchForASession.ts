import { Page } from '@playwright/test'
import HomePage from '../pages/homePage'
import { Team } from '../fixtures/testOptions'

export default async (page: Page, team: Team, startDate: Date = new Date()) => {
  const homePage = new HomePage(page)
  await homePage.expect.toBeOnThePage()

  await homePage.teamFilter.selectTeam(team)
  await homePage.chooseDate(startDate)
  await homePage.submitForm()
  return homePage
}
