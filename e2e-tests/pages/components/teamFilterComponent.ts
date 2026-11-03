import { Locator, Page } from '@playwright/test'
import { Team } from '../../fixtures/testOptions'

export default class TeamFilterComponent {
  teamSelectLocator: Locator

  filterButtonLocator: Locator

  regionSelectLocator: Locator

  applyButtonLocator: Locator

  constructor(page: Page) {
    this.teamSelectLocator = page.getByRole('combobox', { name: 'Project team' })
    this.regionSelectLocator = page.getByLabel('Region')
    this.filterButtonLocator = page.getByRole('button', { name: 'Apply filters' })
    this.applyButtonLocator = page.getByRole('button', { name: 'Apply', exact: true })
  }

  async selectTeam(team: Team) {
    await this.teamSelectLocator.selectOption({ label: team.name })
  }

  async selectRegion(team: Team) {
    await this.regionSelectLocator.selectOption({ label: team.provider })
  }

  async submitForm() {
    await this.filterButtonLocator.click()
  }
}
