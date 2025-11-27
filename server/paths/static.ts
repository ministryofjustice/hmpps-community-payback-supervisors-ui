import { path } from 'static-path'

const cookiesPolicyPath = path('/cookies')
const privacyNoticePath = path('/privacy-notice')

const paths = {
  static: {
    cookiesPolicy: cookiesPolicyPath,
    privacyNotice: privacyNoticePath,
  },
}

export default paths
