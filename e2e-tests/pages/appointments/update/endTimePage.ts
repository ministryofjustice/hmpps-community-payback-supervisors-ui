/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Page, expect } from '@playwright/test'
import BasePage from '../../basePage'
import { AppointmentEndTimeAction } from '../../../../server/@types/user-defined'

export default class EndTimePage extends BasePage {
  readonly titleText = this.getExpectedTitlePattern()

  readonly expect: EndTimePageAssertions

  constructor(
    readonly page: Page,
    private readonly action: AppointmentEndTimeAction,
  ) {
    super(page)
    this.expect = new EndTimePageAssertions(this)
  }

  getExpectedTitlePattern() {
    if (this.action === 'completed') {
      return /You're logging (.*) as finishing today at:/
    }
    if (this.action === 'leftEarly') {
      return /You're logging out (.*) early today at:/
    }
    return /You're logging (.*) as having left at:/
  }
}

class EndTimePageAssertions {
  constructor(private readonly page: EndTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.getExpectedTitlePattern())
  }
}
