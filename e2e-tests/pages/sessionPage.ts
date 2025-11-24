/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from './basePage'

export default class SessionPage extends BasePage {
  readonly expect: SessionPageAssertions

  readonly viewDetailsLinkLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new SessionPageAssertions(this)
    this.viewDetailsLinkLocator = page.getByRole('link', { name: 'View details' })
  }

  async clickOnAnAppointment() {
    await this.viewDetailsLinkLocator.nth(0).click()
  }
}

class SessionPageAssertions {
  constructor(private readonly page: SessionPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Session details')
  }

  async toShowSessionDetails() {
    await expect(this.page.page.getByRole('heading', { name: 'Cleaning streets' })).toBeVisible()
    await expect(this.page.page.getByRole('heading', { name: 'Sunday 1 March 2026' })).toBeVisible()
    await expect(this.page.page.getByRole('listitem')).toContainText([
      'Harry Wormwood',
      'Agatha Trunchbull',
      'Zinnia Wormwood',
    ])
  }
}
