import { RestClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { ContactOutcomesDto } from '../@types/shared'

export default class ReferenceDataClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('referenceDataClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  getContactOutcomes(username: string): Promise<ContactOutcomesDto> {
    const path = paths.referenceData.contactOutcomes.pattern
    return this.get({ path }, asSystem(username))
  }
}
