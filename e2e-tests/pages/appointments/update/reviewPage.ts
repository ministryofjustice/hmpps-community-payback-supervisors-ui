/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class ReviewPage extends BasePage {
  readonly titleText = this.getExpectedTitlePattern()

  private readonly alertPractitionerQuestionLocator: Locator

  readonly expect: ReviewPageAssertions

  constructor(readonly page: Page) {
    super(page)
    this.expect = new ReviewPageAssertions(this)

    this.alertPractitionerQuestionLocator = page.getByRole('group', {
      name: /Would you (?:also )?like this to be sent to the alert diary?/,
    })
  }

  getExpectedTitlePattern() {
    return 'Check your answers'
  }

  async selectAlertPractitioner() {
    await this.alertPractitionerQuestionLocator.getByLabel('Yes').check()
  }
}

class ReviewPageAssertions {
  constructor(private readonly page: ReviewPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
