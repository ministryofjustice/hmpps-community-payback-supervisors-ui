/* istanbul ignore file */

import type { Services } from '../../services'
import PersonDetailsController from './personDetailsController'

const appointmentControllers = (services: Services) => {
  const personDetailsController = new PersonDetailsController(services.appointmentService)

  return {
    personDetailsController,
  }
}

export default appointmentControllers
