/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Page, expect } from '@playwright/test'
import BasePage from '../../basePage'
import { AppointmentCompletedAction } from '../../../../server/@types/user-defined'

export default class EndTimePage extends BasePage {
  readonly titleText = this.getExpectedTitlePattern()

  readonly expect: EndTimePageAssertions

  constructor(
    readonly page: Page,
    private readonly action: AppointmentCompletedAction,
  ) {
    super(page)
    this.expect = new EndTimePageAssertions(this)
  }

  getExpectedTitlePattern() {
    return this.action === 'completed'
      ? /You're logging ([a-zA-Z- ]*) as finishing today at:/
      : /You're logging out ([a-zA-Z- ]*) early today at:/
  }
}

class EndTimePageAssertions {
  constructor(private readonly page: EndTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.getExpectedTitlePattern())
  }
}
