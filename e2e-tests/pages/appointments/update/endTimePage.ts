/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class EndTimePage extends BasePage {
  readonly expect: EndTimePageAssertions

  constructor(readonly page: Page) {
    super(page)
    this.expect = new EndTimePageAssertions(this)
  }
}

class EndTimePageAssertions {
  constructor(private readonly page: EndTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Log end time')
  }
}
