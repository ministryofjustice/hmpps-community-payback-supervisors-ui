import { asSystem, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'

export type FormKey = { type: string; id: string }

export default class FormClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('formClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async find<T>({ type, id }: FormKey, username: string): Promise<T | null> {
    const path = paths.forms({ type, id })
    try {
      return (await this.get({ path }, asSystem(username))) as T
    } catch (err) {
      if (err.responseStatus === 404) {
        return null
      }
      throw err
    }
  }

  async save({ type, id }: FormKey, username: string, data: Record<string, unknown>): Promise<void> {
    const path = paths.forms({ type, id })
    return this.put({ path, data }, asSystem(username))
  }

  async clear({ type, id }: FormKey, username: string): Promise<void> {
    const path = paths.forms({ type, id })
    return this.delete({ path }, asSystem(username))
  }
}
