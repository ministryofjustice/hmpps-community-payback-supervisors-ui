import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { CommonCaseDetailsSummaryDto } from '../@types/shared'
import { BaseRequest } from '../@types/user-defined'

export interface OffenderRequirementRequest extends BaseRequest {
  crn: string
  deliusEventNumber: number
}

export default class OffenderClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('offenderClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async getOffenderSummary({ username, crn }: { username: string; crn: string }): Promise<CommonCaseDetailsSummaryDto> {
    const path = paths.offenderSummary({ crn })
    return (await this.get({ path }, asSystem(username))) as CommonCaseDetailsSummaryDto
  }
}
