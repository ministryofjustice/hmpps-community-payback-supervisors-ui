/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class NotesPage extends BasePage {
  notesFieldLocator: Locator

  isSensitiveLocator: Locator

  readonly expect: NotesPageAssertions

  readonly formHeadingLocator: Locator

  constructor(page: Page) {
    super(page)

    this.formHeadingLocator = page.getByText('Add notes').first()
    this.expect = new NotesPageAssertions(this)

    this.notesFieldLocator = page.getByLabel('Add notes')
    this.isSensitiveLocator = page.getByLabel(
      'This is information that you believe must be recorded but not shared with a person on probation.',
    )
  }

  async completeForm() {
    await this.notesFieldLocator.fill('They did a good job')
    await this.isSensitiveLocator.check()
  }
}

class NotesPageAssertions {
  constructor(private readonly page: NotesPage) {}

  async toBeOnThePage() {
    await expect(this.page.formHeadingLocator).toBeVisible()
  }
}
