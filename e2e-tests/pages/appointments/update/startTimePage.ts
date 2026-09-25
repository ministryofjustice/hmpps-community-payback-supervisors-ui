/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class StartTimePage extends BasePage {
  readonly titleText = 'Log start time'

  readonly expect: StartTimePageAssertions

  question: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new StartTimePageAssertions(this)
    this.question = this.headingLocator.getByText(this.titleText)
  }
}

class StartTimePageAssertions {
  constructor(private readonly page: StartTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.question).toContainText('Log start time')
  }
}
