import { Factory } from 'fishery'
import { ErrorResponse } from '../../@types/shared'

export default Factory.define<ErrorResponse>(() => ({
  status: 400,
  success: false,
  hasContent: false,
  hasErrors: true,
  hasWarnings: false,
  errors: [],
  warnings: [],
  userMessage: 'An error occurred',
  developerMessage: '',
}))
