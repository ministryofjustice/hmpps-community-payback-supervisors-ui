/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'
import BasePage from './basePage'
import SummaryListComponent from './components/summaryListComponent'
import { AppointmentStatusType } from '../../server/@types/user-defined'

export default class AppointmentPage extends BasePage {
  readonly expect: AppointmentPageAssertions

  readonly details: SummaryListComponent

  readonly arrivedButtonLocator: Locator

  readonly notArrivedButtonLocator: Locator

  readonly finishButtonLocator: Locator

  constructor(readonly page: Page) {
    super(page)
    this.expect = new AppointmentPageAssertions(this)
    this.details = new SummaryListComponent(page)
    this.arrivedButtonLocator = page.getByRole('button', { name: 'Arrived', exact: true })
    this.notArrivedButtonLocator = page.getByRole('button', { name: 'Not arrived' })
    this.finishButtonLocator = page.getByRole('button', { name: 'Finish session' })
  }

  async clickArrived() {
    await this.arrivedButtonLocator.click()
  }

  async clickNotArrived() {
    await this.notArrivedButtonLocator.click()
  }

  async clickFinishSession() {
    await this.finishButtonLocator.click()
  }
}

class AppointmentPageAssertions {
  readonly appointmentPage: AppointmentPage

  constructor(private readonly page: AppointmentPage) {
    this.appointmentPage = page
  }

  async toBeOnThePage() {
    await expect(this.page.headingLocator).toContainText('Harry Wormwood')
  }

  async toShowAppointmentDetails() {
    await this.appointmentPage.details.expect.toHaveItemWith('Start time', '09:00')
    await this.appointmentPage.details.expect.toHaveItemWith('Finish time', '17:00')
  }

  async toShowStatus(status: AppointmentStatusType) {
    await this.appointmentPage.details.expect.toHaveItemWith('Session status', status)
  }

  async toShowOffenderDetails() {
    await this.page.page.locator('span', { hasText: 'CRN: X948762' }).textContent()
  }
}
