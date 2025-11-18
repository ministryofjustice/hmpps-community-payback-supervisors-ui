/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class StartTimePage extends BasePage {
  readonly titleText = 'You are logging Harry Wormwood as having arrived at:'

  readonly expect: StartTimePageAssertions

  private readonly startTimeFieldLocator: Locator

  private readonly continueButtonLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new StartTimePageAssertions(this)
    this.startTimeFieldLocator = page.getByLabel(this.titleText)
    this.continueButtonLocator = page.getByRole('button', { name: 'continue' })
  }

  async clickContinue() {
    await this.continueButtonLocator.click()
  }

  async enterAStartTime() {
    await this.startTimeFieldLocator.fill('09:30')
  }
}

class StartTimePageAssertions {
  constructor(private readonly page: StartTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
