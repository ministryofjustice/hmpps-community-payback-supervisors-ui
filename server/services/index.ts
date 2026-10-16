import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import AuditService from './auditService'
import SessionService from './sessionService'
import ReferenceDataService from './referenceDataService'
import SupervisorService from './supervisorService'
import AppointmentFormService from './appointmentFormService'
import OffenderService from './offenderService'

export const services = () => {
  const {
    applicationInfo,
    auditClient,
    sessionClient,
    appointmentClient,
    referenceDataClient,
    formClient,
    supervisorClient,
    offenderClient,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(auditClient),
    sessionService: new SessionService(sessionClient),
    appointmentService: new AppointmentService(appointmentClient),
    referenceDataService: new ReferenceDataService(referenceDataClient),
    supervisorService: new SupervisorService(supervisorClient),
    appointmentFormService: new AppointmentFormService(formClient),
    offenderService: new OffenderService(offenderClient),
  }
}

export type Services = ReturnType<typeof services>
