/* istanbul ignore file */

import type { Services } from '../../services'
import ConfirmController from './confirmController'
import ShowDetailsController from './showDetailsController'
import StartTimeController from './startTimeController'
import EndTimeController from './endTimeController'
import ComplianceController from './complianceController'
import AttendanceOutcomeController from './attendanceOutcomeController'
import NotesController from './notesController'

const appointmentControllers = (services: Services) => {
  const showDetailsController = new ShowDetailsController(services.appointmentService, services.referenceDataService)
  const startTimeController = new StartTimeController(services.appointmentService, services.appointmentFormService)
  const endTimeController = new EndTimeController(services.appointmentService, services.appointmentFormService)
  const complianceController = new ComplianceController(services.appointmentService, services.appointmentFormService)
  const confirmController = new ConfirmController(services.appointmentService)

  const attendanceOutcomeController = new AttendanceOutcomeController(
    services.appointmentService,
    services.referenceDataService,
    services.appointmentFormService,
  )

  const notesController = new NotesController(
    services.appointmentService,
    services.referenceDataService,
    services.appointmentFormService,
  )

  return {
    showDetailsController,
    startTimeController,
    confirmController,
    endTimeController,
    complianceController,
    attendanceOutcomeController,
    notesController,
  }
}

export default appointmentControllers
