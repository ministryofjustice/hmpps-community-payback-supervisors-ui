/* istanbul ignore file */

import type { Services } from '../../services'
import AbleToWorkController from './ableToWorkController'
import ConfirmController from './confirmController'
import ShowDetailsController from './showDetailsController'
import StartTimeController from './startTimeController'

const appointmentControllers = (services: Services) => {
  const showDetailsController = new ShowDetailsController(services.appointmentService)
  const startTimeController = new StartTimeController(services.appointmentService)
  const ableToWorkController = new AbleToWorkController(services.appointmentService)
  const confirmController = new ConfirmController(services.appointmentService)

  return {
    showDetailsController,
    startTimeController,
    ableToWorkController,
    confirmController,
  }
}

export default appointmentControllers
