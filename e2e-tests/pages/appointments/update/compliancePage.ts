/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export default class CompliancePage extends BasePage {
  hiVisFieldLocator: Locator

  workedIntensivelyFieldLocator: Locator

  workedQualityFieldLocator: Locator

  behaviourFieldLocator: Locator

  notesFieldLocator: Locator

  expect: CompliancePageAssertions

  constructor(page: Page) {
    super(page)
    this.expect = new CompliancePageAssertions(this)
    this.hiVisFieldLocator = page.getByRole('group', { name: 'Did they wear hi-vis?' })
    this.workedIntensivelyFieldLocator = page.getByRole('group', { name: 'Are they working intensively' })
    this.workedQualityFieldLocator = page.getByRole('group', { name: 'How was their work quality?' })
    this.behaviourFieldLocator = page.getByRole('group', { name: 'How was their behaviour?' })
    this.notesFieldLocator = page.getByLabel('Notes')
  }

  async enterComplianceDetails() {
    await this.hiVisFieldLocator.getByRole('radio', { name: 'Yes' }).check()
    await this.workedIntensivelyFieldLocator.getByRole('radio', { name: 'Yes' }).check()
    await this.workedQualityFieldLocator.getByRole('radio', { name: 'Good' }).check()
    await this.behaviourFieldLocator.getByRole('radio', { name: 'Poor' }).check()
    await this.notesFieldLocator.fill('They did a good job')
  }
}

class CompliancePageAssertions {
  constructor(private readonly page: CompliancePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Log compliance')
  }
}
