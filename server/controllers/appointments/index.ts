/* istanbul ignore file */

import type { Services } from '../../services'
import IsAbleToWorkController from './isAbleToWorkController'
import ConfirmController from './confirmController'
import ShowDetailsController from './showDetailsController'
import StartTimeController from './startTimeController'
import UnableToWorkController from './unableToWorkController'
import EndTimeController from './endTimeController'
import ComplianceController from './complianceController'
import LeftEarlyReasonController from './leftEarlyReasonController'

const appointmentControllers = (services: Services) => {
  const showDetailsController = new ShowDetailsController(
    services.appointmentService,
    services.appointmentStatusService,
  )
  const startTimeController = new StartTimeController(services.appointmentService)
  const isAbleToWorkController = new IsAbleToWorkController(
    services.appointmentService,
    services.appointmentStatusService,
  )
  const unableToWorkController = new UnableToWorkController(services.appointmentService, services.referenceDataService)
  const endTimeController = new EndTimeController(services.appointmentService)
  const complianceController = new ComplianceController(services.appointmentService)
  const confirmController = new ConfirmController(services.appointmentService)
  const leftEarlyReasonController = new LeftEarlyReasonController(
    services.appointmentService,
    services.referenceDataService,
  )

  return {
    showDetailsController,
    startTimeController,
    isAbleToWorkController,
    confirmController,
    unableToWorkController,
    endTimeController,
    complianceController,
    leftEarlyReasonController,
  }
}

export default appointmentControllers
