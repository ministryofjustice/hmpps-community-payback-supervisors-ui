import { Page } from '@playwright/test'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmAbsentPage extends BaseConfirmPage {
  constructor(readonly page: Page) {
    super(page, 'You have recorded the outcome for')
  }
}
