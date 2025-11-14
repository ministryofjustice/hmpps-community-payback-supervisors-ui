/* istanbul ignore file */

import { Services } from '../services'
import SessionsController from './sessionsController'
import appointmentControllers from './appointments'

export const controllers = (services: Services) => {
  const sessionsController = new SessionsController(services.sessionService)

  return {
    sessionsController,
    appointments: {
      ...appointmentControllers(services),
    },
  }
}

export type Controllers = ReturnType<typeof controllers>
