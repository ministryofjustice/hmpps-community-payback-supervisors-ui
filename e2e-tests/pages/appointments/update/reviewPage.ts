/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class ReviewPage extends BasePage {
  readonly titleText = this.getExpectedTitlePattern()

  readonly expect: ReviewPageAssertions

  constructor(readonly page: Page) {
    super(page)
    this.expect = new ReviewPageAssertions(this)
  }

  getExpectedTitlePattern() {
    return 'Check your answers'
  }
}

class ReviewPageAssertions {
  constructor(private readonly page: ReviewPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
