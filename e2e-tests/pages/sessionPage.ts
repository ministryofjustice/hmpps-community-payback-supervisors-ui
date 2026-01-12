/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { expect, Locator, Page } from '@playwright/test'
import BasePage from './basePage'
import { AppointmentTestData } from '../delius/deliusTestData'
import { AppointmentStatusType } from '../../server/@types/user-defined'

export default class SessionPage extends BasePage {
  readonly expect: SessionPageAssertions

  readonly viewDetailsLinkLocator: Locator

  clearSessionDataLinkLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new SessionPageAssertions(this)
    this.viewDetailsLinkLocator = page.getByRole('link', { name: 'View and update' })
    this.clearSessionDataLinkLocator = page.getByRole('link', { name: 'Clear session data' })
  }

  async clickOnAnAppointmentForPerson(personName: string) {
    await this.page
      .locator('.govuk-summary-card', {
        has: this.page.getByRole('heading', { name: personName }),
      })
      .getByRole('link', { name: 'View and update' })
      .click()
  }

  async appointment(personName: string): Promise<Locator> {
    return this.page.locator('.govuk-summary-card', {
      has: this.page.getByRole('heading', { name: personName }),
    })
  }
}

class SessionPageAssertions {
  constructor(private readonly page: SessionPage) {}

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Session details')
  }

  async toShowSessionDetails(deliusTestData: AppointmentTestData) {
    await expect(this.page.page.getByRole('heading', { name: deliusTestData.project.name })).toBeVisible()
    await expect(
      this.page.page.getByRole('heading', {
        name: this.getCurrentDateInFormatForSession(),
      }),
    ).toBeVisible()
    const expectedNames = deliusTestData.pops.map(pop => pop.getFullName())
    const summaryCardTitles = this.page.page.locator('h3.govuk-summary-card__title')

    const actualNames = (await summaryCardTitles.allInnerTexts()).map(text => text.trim().replace(/\s+/g, ' '))
    expect(actualNames.sort()).toEqual(expectedNames.sort())
  }

  private getCurrentDateInFormatForSession() {
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    return formattedDate.replace(/,/g, '')
  }

  async appointmentToHaveStatus(personName: string, status: AppointmentStatusType) {
    const appointment = await this.page.appointment(personName)
    await expect(appointment).toContainText(status)
  }
}
