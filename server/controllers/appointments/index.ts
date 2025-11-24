/* istanbul ignore file */

import type { Services } from '../../services'
import AbleToWorkController from './ableToWorkController'
import ConfirmController from './confirmController'
import ShowDetailsController from './showDetailsController'
import StartTimeController from './startTimeController'
import UnableToWorkController from './unableToWorkController'

const appointmentControllers = (services: Services) => {
  const showDetailsController = new ShowDetailsController(services.appointmentService)
  const startTimeController = new StartTimeController(services.appointmentService)
  const ableToWorkController = new AbleToWorkController(services.appointmentService)
  const unableToWorkController = new UnableToWorkController(services.appointmentService, services.referenceDataService)
  const confirmController = new ConfirmController(services.appointmentService)

  return {
    showDetailsController,
    startTimeController,
    ableToWorkController,
    confirmController,
    unableToWorkController,
  }
}

export default appointmentControllers
