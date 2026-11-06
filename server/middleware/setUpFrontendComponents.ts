import pdsComponents from '@ministryofjustice/hmpps-probation-frontend-components'
import config from '../config'
import logger from '../../logger'

type RequestOptions = Parameters<typeof pdsComponents.getPageComponents>[0]

export default function setUpFrontendComponents() {
  return pdsComponents.getPageComponents({
    pdsUrl: config.apis.probationFrontendComponents.url,
    environmentName: config.environmentName as RequestOptions['environmentName'],
    logger,
    timeoutOptions: config.apis.probationFrontendComponents.timeout,
    useFallbacksByDefault: config.apis.probationFrontendComponents.useFallbacksByDefault,
  })
}
