/* istanbul ignore file */

import { Services } from '../services'
import SessionsController from './sessionsController'
import appointmentControllers from './appointments'
import IndexController from './indexController'

export const controllers = (services: Services) => {
  const sessionsController = new SessionsController(services.sessionService)
  const indexController = new IndexController(services.sessionService)

  return {
    indexController,
    sessionsController,
    appointments: {
      ...appointmentControllers(services),
    },
  }
}

export type Controllers = ReturnType<typeof controllers>
