/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'
import { AppointmentArrivedAction } from '../../../../server/@types/user-defined'

export default class StartTimePage extends BasePage {
  readonly titleText = this.getExpectedTitle()

  readonly expect: StartTimePageAssertions

  private readonly startTimeFieldLocator: Locator

  constructor(
    readonly page: Page,
    private readonly action: AppointmentArrivedAction,
  ) {
    super(page)
    this.expect = new StartTimePageAssertions(this)
    this.startTimeFieldLocator = page.getByLabel(this.titleText)
  }

  getExpectedTitle() {
    return this.action === 'arrived'
      ? "You're logging Harry Wormwood as having arrived at:"
      : "You're logging Harry Wormwood as absent today at:"
  }

  async enterAStartTime() {
    await this.startTimeFieldLocator.fill('09:30')
  }
}

class StartTimePageAssertions {
  constructor(private readonly page: StartTimePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.getExpectedTitle())
  }
}
