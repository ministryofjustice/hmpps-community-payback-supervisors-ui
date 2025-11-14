/* istanbul ignore file */

import type { Services } from '../../services'
import AbleToWorkController from './ableToWorkController'
import PersonDetailsController from './personDetailsController'

const appointmentControllers = (services: Services) => {
  const personDetailsController = new PersonDetailsController(services.appointmentService)
  const ableToWorkController = new AbleToWorkController(services.appointmentService)

  return {
    personDetailsController,
    ableToWorkController,
  }
}

export default appointmentControllers
