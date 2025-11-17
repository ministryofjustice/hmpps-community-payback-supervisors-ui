/* eslint max-classes-per-file: "off" -- splitting out these classes would cause an import dependency loop */

import { Locator, Page, expect } from '@playwright/test'

export default class SummaryListComponent {
  readonly expect: SummaryListAssertions

  readonly listItems: Locator

  constructor(page: Page) {
    this.expect = new SummaryListAssertions(this)
    const list = page.locator('dl')
    this.listItems = list.locator('div')
  }

  itemWithLabel(label: string) {
    return this.listItems.filter({ hasText: label })
  }
}

class SummaryListAssertions {
  constructor(private readonly component: SummaryListComponent) {}

  async toHaveItemWith(label: string, value: string) {
    expect(this.component.itemWithLabel(label)).toContainText(value)
  }
}
