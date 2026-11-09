/* istanbul ignore file */

import { Services } from '../services'
import SessionsController from './sessionsController'
import appointmentControllers from './appointments'
import IndexController from './indexController'
import DataController from './shared/dataController'

export const controllers = (services: Services) => {
  const sessionsController = new SessionsController(services.auditService, services.sessionService)
  const indexController = new IndexController(
    services.sessionService,
    services.supervisorService,
    services.providerService,
  )
  const dataController = new DataController(services.providerService)

  return {
    indexController,
    sessionsController,
    dataController,
    appointments: {
      ...appointmentControllers(services),
    },
  }
}

export type Controllers = ReturnType<typeof controllers>
