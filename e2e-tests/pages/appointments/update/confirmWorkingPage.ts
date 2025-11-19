/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class ConfirmWorkingPage extends BasePage {
  readonly titleText = 'Alexy Boyle has been recorded as starting work today?'

  readonly expect: ConfirmWorkingPageAssertions

  private readonly linkToSessionPageLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new ConfirmWorkingPageAssertions(this)
    this.linkToSessionPageLocator = page.getByRole('link', { name: 'Return to session page' })
  }

  async clickLinkToSessionPage() {
    await this.linkToSessionPageLocator.click()
  }
}

class ConfirmWorkingPageAssertions {
  constructor(private readonly page: ConfirmWorkingPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
