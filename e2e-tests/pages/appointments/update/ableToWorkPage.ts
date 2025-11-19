/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class AbleToWorkPage extends BasePage {
  readonly titleText = 'Can Harry Wormwood work today?'

  readonly expect: AbleToWorkPageAssertions

  private readonly continueButtonLocator: Locator

  private readonly ableToWorkLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new AbleToWorkPageAssertions(this)
    this.continueButtonLocator = page.getByRole('button', { name: 'continue' })
    this.ableToWorkLocator = page.getByRole('group', { name: this.titleText })
  }

  async clickContinue() {
    await this.continueButtonLocator.click()
  }

  async checkYes() {
    await this.ableToWorkLocator.getByRole('radio', { name: 'Yes' }).check()
  }
}

class AbleToWorkPageAssertions {
  constructor(private readonly page: AbleToWorkPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
