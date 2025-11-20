/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../../basePage'

export default abstract class BaseConfirmPage extends BasePage {
  private readonly linkToSessionPageLocator: Locator

  readonly expect: ConfirmPageAssertions

  constructor(
    readonly page: Page,
    readonly titleText: string,
  ) {
    super(page)
    this.linkToSessionPageLocator = page.getByRole('link', { name: 'Return to session page' })
    this.expect = new ConfirmPageAssertions(this)
  }

  async clickLinkToSessionPage() {
    await this.linkToSessionPageLocator.click()
  }
}

class ConfirmPageAssertions {
  constructor(private readonly page: BaseConfirmPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
