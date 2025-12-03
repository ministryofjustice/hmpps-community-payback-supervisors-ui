/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Page, expect } from '@playwright/test'
import BasePage from '../../basePage'
import { AppointmentCompletedAction } from '../../../../server/@types/user-defined'

export default class EndTimePage extends BasePage {
  readonly titleText = this.getExpectedTitle()

  readonly expect: EndTimePageAssertions

  constructor(
    readonly page: Page,
    private readonly action: AppointmentCompletedAction,
  ) {
    super(page)
    this.expect = new EndTimePageAssertions(this)
  }

  getExpectedTitle() {
    return this.action === 'completed'
      ? "You're logging Harry Wormwood as finishing today at:"
      : "You're logging out Harry Wormwood early at:"
  }
}

class EndTimePageAssertions {
  constructor(private readonly page: EndTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.getExpectedTitle())
  }
}
