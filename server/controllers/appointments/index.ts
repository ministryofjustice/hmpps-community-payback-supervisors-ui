/* istanbul ignore file */

import type { Services } from '../../services'
import AbleToWorkController from './ableToWorkController'
import PersonDetailsController from './personDetailsController'
import StartTimeController from './startTimeController'

const appointmentControllers = (services: Services) => {
  const personDetailsController = new PersonDetailsController(services.appointmentService)
  const startTimeController = new StartTimeController(services.appointmentService)
  const ableToWorkController = new AbleToWorkController(services.appointmentService)

  return {
    personDetailsController,
    startTimeController,
    ableToWorkController,
  }
}

export default appointmentControllers
