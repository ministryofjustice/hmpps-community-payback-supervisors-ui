/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class UnableToWorkPage extends BasePage {
  readonly titleText = 'Why is Harry Wormwood unable to work today?'

  readonly expect: UnableToWorkPageAssertions

  private readonly unableToWorkReasonLocator: Locator

  private readonly notesLocator: Locator

  private readonly isSensitiveLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new UnableToWorkPageAssertions(this)
    this.unableToWorkReasonLocator = page.getByRole('group', { name: this.titleText })
    this.notesLocator = page.getByLabel('Add notes')
    this.isSensitiveLocator = page.getByLabel('This information is not to be shared with the person on probation')
  }

  async checkAttendedFailedToComply() {
    await this.unableToWorkReasonLocator.getByRole('radio', { name: 'Attended - Failed to Comply' }).check()
  }

  async enterNotes() {
    await this.notesLocator.fill('Appointment notes')
  }

  async checkIsSensitive() {
    await this.isSensitiveLocator.check()
  }
}

class UnableToWorkPageAssertions {
  constructor(private readonly page: UnableToWorkPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText(this.page.titleText)
  }
}
