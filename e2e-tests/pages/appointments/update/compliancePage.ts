/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from '../../basePage'

export interface ComplianceDetails {
  hiVis: 'Yes' | 'No'
  workedIntensively: 'Yes' | 'No'
  workQuality: 'Excellent' | 'Good' | 'Not Applicable' | 'Poor' | 'Satisfactory' | 'Unsatisfactory'
  behaviour: 'Excellent' | 'Good' | 'Not Applicable' | 'Poor' | 'Satisfactory' | 'Unsatisfactory'
  notes: string
}

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

  async enterComplianceDetails(details: ComplianceDetails) {
    await this.hiVisFieldLocator.getByRole('radio', { name: details.hiVis }).check()
    await this.workedIntensivelyFieldLocator.getByRole('radio', { name: details.workedIntensively }).check()
    await this.workedQualityFieldLocator.getByRole('radio', { name: details.workQuality }).check()
    await this.behaviourFieldLocator.getByRole('radio', { name: details.behaviour }).check()
    await this.notesFieldLocator.fill(details.notes)
  }
}

class CompliancePageAssertions {
  constructor(private readonly page: CompliancePage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Log compliance')
  }
}
