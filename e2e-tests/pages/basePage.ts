import { Locator, Page } from '@playwright/test'

export default class BasePage {
  readonly headingLocator: Locator

  private readonly backLinkLocator: Locator

  private readonly continueButtonLocator: Locator

  constructor(page: Page) {
    this.headingLocator = page.getByRole('heading', { level: 1 })
    this.backLinkLocator = page.getByRole('link', { name: 'Back', exact: true })
    this.continueButtonLocator = page.getByRole('button', { name: 'continue' })
  }

  async clickBack() {
    await this.backLinkLocator.click()
  }

  async clickContinue() {
    await this.continueButtonLocator.click()
  }
}
