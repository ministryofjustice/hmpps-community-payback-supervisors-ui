/* istanbul ignore file */

import { Services } from '../services'
import SessionsController from './sessionsController'
import appointmentControllers from './appointments'
import IndexController from './indexController'
import StaticController from './staticController'

export const controllers = (services: Services) => {
  const sessionsController = new SessionsController(services.sessionService, services.appointmentStatusService)
  const indexController = new IndexController(services.sessionService)
  const staticController = new StaticController()

  return {
    indexController,
    sessionsController,
    appointments: {
      ...appointmentControllers(services),
    },
    staticController,
  }
}

export type Controllers = ReturnType<typeof controllers>
