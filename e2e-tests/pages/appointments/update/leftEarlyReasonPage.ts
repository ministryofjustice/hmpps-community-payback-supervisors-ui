/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class LeftEarlyReasonPage extends BasePage {
  readonly titleText = /Why did (.*) leave early?/

  readonly expect: LeftEarlyReasonPageAssertions

  private readonly leftEarlyReasonLocator: Locator

  private readonly notesLocator: Locator

  private readonly isSensitiveLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new LeftEarlyReasonPageAssertions(this)
    this.leftEarlyReasonLocator = page.getByRole('group', { name: this.titleText })
    this.notesLocator = page.getByLabel('Add notes')
    this.isSensitiveLocator = page.getByLabel('This information is not to be shared with the person on probation')
  }

  async checkAttendedFailedToComply() {
    await this.leftEarlyReasonLocator.getByRole('radio', { name: 'Attended - Failed to Comply' }).check()
  }

  async enterNotes() {
    await this.notesLocator.fill('Appointment notes')
  }

  async checkIsSensitive() {
    await this.isSensitiveLocator.check()
  }
}

class LeftEarlyReasonPageAssertions {
  constructor(private readonly page: LeftEarlyReasonPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
