import { Page } from '@playwright/test'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmWorkingPage extends BaseConfirmPage {
  constructor(readonly page: Page) {
    super(page, 'Harry Wormwood has been recorded as starting work today')
  }
}
