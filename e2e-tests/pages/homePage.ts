/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from './basePage'

export default class HomePage extends BasePage {
  readonly expect: HomePageAssertions

  readonly trackCommunityPaybackProgressLink: Locator

  viewDetailsLinkLocator: Locator

  constructor(private readonly page: Page) {
    super(page)
    this.expect = new HomePageAssertions(this)
    this.viewDetailsLinkLocator = page.getByRole('button', { name: 'View details' }).last()
  }

  async visit() {
    await this.page.goto('/')
  }
}

class HomePageAssertions {
  constructor(private readonly page: HomePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Next session')
  }
}
