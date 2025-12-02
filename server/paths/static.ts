import { path } from 'static-path'

const cookiesPolicyPath = path('/cookies')
const privacyNoticePath = path('/privacy-notice')
const accessibilityStatementPath = path('/accessibility-statement')

const paths = {
  static: {
    cookiesPolicy: cookiesPolicyPath,
    privacyNotice: privacyNoticePath,
    accessibilityStatement: accessibilityStatementPath,
  },
}

export default paths
