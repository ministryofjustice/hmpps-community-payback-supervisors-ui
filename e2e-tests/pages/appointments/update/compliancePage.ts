/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class CompliancePage extends BasePage {
  workedQualityFieldLocator: Locator

  behaviourFieldLocator: Locator

  expect: CompliancePageAssertions

  constructor(page: Page) {
    super(page)
    this.expect = new CompliancePageAssertions(this)
    this.workedQualityFieldLocator = page.getByRole('group', { name: 'How was their work quality?' })
    this.behaviourFieldLocator = page.getByRole('group', { name: 'How was their behaviour?' })
  }

  async enterComplianceDetails() {
    await this.workedQualityFieldLocator.getByRole('radio', { name: 'Good' }).check()
    await this.behaviourFieldLocator.getByRole('radio', { name: 'Poor' }).check()
  }
}

class CompliancePageAssertions {
  constructor(private readonly page: CompliancePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Log compliance')
  }
}
