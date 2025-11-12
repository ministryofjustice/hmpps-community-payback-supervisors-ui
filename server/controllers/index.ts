/* istanbul ignore file */

import { Services } from '../services'
import SessionsController from './sessionsController'

export const controllers = (services: Services) => {
  const sessionsController = new SessionsController(services.sessionService)

  return {
    sessionsController,
  }
}

export type Controllers = ReturnType<typeof controllers>
