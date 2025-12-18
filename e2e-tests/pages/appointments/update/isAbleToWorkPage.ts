/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class IsAbleToWorkPage extends BasePage {
  readonly titleTextPattern = /Can (.*) work today?/

  readonly expect: IsAbleToWorkPageAssertions

  private readonly ableToWorkLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new IsAbleToWorkPageAssertions(this)
    this.ableToWorkLocator = page.getByRole('group', { name: this.titleTextPattern })
  }

  async checkYes() {
    await this.ableToWorkLocator.getByRole('radio', { name: 'Yes' }).check()
  }

  async checkNo() {
    await this.ableToWorkLocator.getByRole('radio', { name: 'No' }).check()
  }
}

class IsAbleToWorkPageAssertions {
  constructor(private readonly page: IsAbleToWorkPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleTextPattern)
  }
}
