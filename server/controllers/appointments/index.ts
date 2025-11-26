/* istanbul ignore file */

import type { Services } from '../../services'
import IsAbleToWorkController from './isAbleToWorkController'
import ConfirmController from './confirmController'
import ShowDetailsController from './showDetailsController'
import StartTimeController from './startTimeController'
import UnableToWorkController from './unableToWorkController'

const appointmentControllers = (services: Services) => {
  const showDetailsController = new ShowDetailsController(services.appointmentService)
  const startTimeController = new StartTimeController(services.appointmentService)
  const isAbleToWorkController = new IsAbleToWorkController(services.appointmentService)
  const unableToWorkController = new UnableToWorkController(services.appointmentService, services.referenceDataService)
  const confirmController = new ConfirmController(services.appointmentService)

  return {
    showDetailsController,
    startTimeController,
    isAbleToWorkController,
    confirmController,
    unableToWorkController,
  }
}

export default appointmentControllers
