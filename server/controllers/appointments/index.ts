/* istanbul ignore file */

import type { Services } from '../../services'
import ConfirmController from './confirmController'
import ShowDetailsController from './showDetailsController'
import StartTimeController from './startTimeController'
import UnableToWorkController from './unableToWorkController'
import EndTimeController from './endTimeController'
import ComplianceController from './complianceController'

const appointmentControllers = (services: Services) => {
  const showDetailsController = new ShowDetailsController(
    services.appointmentService,
    services.appointmentStatusService,
  )
  const startTimeController = new StartTimeController(
    services.appointmentService,
    services.appointmentStatusService,
    services.appointmentFormService,
  )
  const unableToWorkController = new UnableToWorkController(
    services.appointmentService,
    services.appointmentStatusService,
    services.referenceDataService,
    services.appointmentFormService,
  )
  const endTimeController = new EndTimeController(services.appointmentService, services.appointmentFormService)
  const complianceController = new ComplianceController(
    services.appointmentService,
    services.referenceDataService,
    services.appointmentFormService,
    services.appointmentStatusService,
  )
  const confirmController = new ConfirmController(services.appointmentService)

  return {
    showDetailsController,
    startTimeController,
    confirmController,
    unableToWorkController,
    endTimeController,
    complianceController,
  }
}

export default appointmentControllers
