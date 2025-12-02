import { Locator, Page } from '@playwright/test'

export default class BasePage {
  readonly headingLocator: Locator

  private readonly backLinkLocator: Locator

  constructor(page: Page) {
    this.headingLocator = page.getByRole('heading', { level: 1 })
    this.backLinkLocator = page.getByRole('link', { name: 'Back', exact: true })
  }

  async clickBack() {
    await this.backLinkLocator.click()
  }
}
