/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { expect, Page } from '@playwright/test'
import BasePage from './basePage'

export default class HomePage extends BasePage {
  readonly expect: HomePageAssertions

  constructor(private readonly page: Page) {
    super(page)
    this.expect = new HomePageAssertions(this)
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
}

class HomePageAssertions {
  constructor(private readonly page: HomePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Next session')
  }
}
