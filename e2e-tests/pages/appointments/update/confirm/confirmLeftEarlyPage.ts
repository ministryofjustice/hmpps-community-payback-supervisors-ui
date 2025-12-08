import { Page } from '@playwright/test'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmLeftEarlyPage extends BaseConfirmPage {
  constructor(readonly page: Page) {
    super(page, 'has been recorded as leaving the site early')
  }
}
