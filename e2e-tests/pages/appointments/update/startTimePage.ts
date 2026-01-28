/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'
import { AppointmentArrivedAction } from '../../../../server/@types/user-defined'

export default class StartTimePage extends BasePage {
  readonly titleText = this.getExpectedTitlePattern()

  readonly expect: StartTimePageAssertions

  question: Locator

  constructor(
    readonly page: Page,
    private readonly action: AppointmentArrivedAction,
  ) {
    super(page)
    this.expect = new StartTimePageAssertions(this)
    this.question = this.headingLocator.getByText("You're logging")
  }

  getExpectedTitlePattern() {
    const questionEnd = this.action === 'arrived' ? 'as having arrived at:' : 'as absent today at:'
    return new RegExp(`You're logging (.*) ${questionEnd}`)
  }
}

class StartTimePageAssertions {
  constructor(private readonly page: StartTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.question).toContainText(this.page.getExpectedTitlePattern())
  }
}
