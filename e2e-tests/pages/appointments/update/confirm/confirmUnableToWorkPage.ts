import { Page } from '@playwright/test'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmUnableToWorkPage extends BaseConfirmPage {
  constructor(readonly page: Page) {
    super(page, 'has been recorded as being unable to work')
  }
}
