/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { expect, Page, Locator } from '@playwright/test'
import BasePage from './basePage'
import TeamFilterComponent from './components/teamFilterComponent'

export default class HomePage extends BasePage {
  readonly expect: HomePageAssertions

  readonly dateFieldLocator: Locator

  readonly teamFilter: TeamFilterComponent

  constructor(private readonly page: Page) {
    super(page)
    this.expect = new HomePageAssertions(this)
    this.teamFilter = new TeamFilterComponent(page)
    this.dateFieldLocator = page.getByLabel('Date')
  }

  async clickViewDetailsForProject(projectName: string) {
    await this.page
      .locator('.govuk-notification-banner__content', {
        has: this.page.getByRole('heading', { name: projectName }),
      })
      .getByRole('button', { name: 'View details' })
      .click()
  }

  async visit() {
    await this.page.goto('/')
  }

  async completeSearchForm(fromDate: Date) {
    const day = fromDate.getDate().toString()
    const month = (fromDate.getMonth() + 1).toString()
    const year = fromDate.getFullYear().toString()
    await this.dateFieldLocator.fill(`${day}/${month}/${year}`)
  }

  async submitForm() {
    await this.teamFilter.submitForm()
  }
}

class HomePageAssertions {
  constructor(private readonly page: HomePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Next session')
  }
}
