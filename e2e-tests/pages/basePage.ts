import { Locator, Page } from '@playwright/test'

export default class BasePage {
  readonly headingLocator: Locator

  readonly pageHeadingLocator: Locator

  readonly labelLocator: Locator

  private readonly backLinkLocator: Locator

  private readonly continueButtonLocator: Locator

  constructor(page: Page) {
    const main = page.getByRole('main')
    this.headingLocator = main.getByRole('heading', { level: 1 })
    this.pageHeadingLocator = main.getByRole('heading', { level: 2 })
    this.labelLocator = main.locator('label')
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
