import { Page } from '@playwright/test'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmCompletedPage extends BaseConfirmPage {
  constructor(readonly page: Page) {
    super(page, 'has completed the session')
  }
}
