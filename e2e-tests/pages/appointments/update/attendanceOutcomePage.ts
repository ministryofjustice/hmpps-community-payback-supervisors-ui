/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class AttendanceOutcomePage extends BasePage {
  attendedCompliedOutcomeLocator: Locator

  readonly expect: AttendanceOutcomePageAssertions

  readonly formHeadingLocator: Locator

  constructor(page: Page) {
    super(page)

    this.formHeadingLocator = page.getByText('Log attendance').first()
    this.expect = new AttendanceOutcomePageAssertions(this)
    this.attendedCompliedOutcomeLocator = page.getByLabel('Attended \u2013 complied')
  }

  async chooseAttendedCompliedOutcome() {
    await this.attendedCompliedOutcomeLocator.check()
  }
}

class AttendanceOutcomePageAssertions {
  constructor(private readonly page: AttendanceOutcomePage) {}

  async toBeOnThePage() {
    await expect(this.page.formHeadingLocator).toBeVisible()
  }
}
