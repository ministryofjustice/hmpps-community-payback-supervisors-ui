/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Page, expect } from '@playwright/test'
import BasePage from './basePage'

export default class AppointmentPage extends BasePage {
  readonly expect: AppointmentPageAssertions

  constructor(readonly page: Page) {
    super(page)
    this.expect = new AppointmentPageAssertions(this)
  }
}

class AppointmentPageAssertions {
  constructor(private readonly page: AppointmentPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Harry Wormwood')
  }
}
