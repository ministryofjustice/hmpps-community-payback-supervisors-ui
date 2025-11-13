/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from './basePage'

export default class SessionPage extends BasePage {
  readonly expect: SessionPageAssertions

  readonly trackCommunityPaybackProgressLink: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new SessionPageAssertions(this)
  }

  async visit() {
    await this.page.goto('/')
  }
}

class SessionPageAssertions {
  constructor(private readonly page: SessionPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Session details')
  }

  async toShowSessionDetails() {
    await expect(this.page.page.getByRole('heading', { name: 'Cleaning streets' })).toBeVisible()
    await expect(this.page.page.getByRole('heading', { name: 'Monday 15 September 2025' })).toBeVisible()
  }
}
