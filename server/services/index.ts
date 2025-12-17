import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import AppointmentStatusService from './appointmentStatusService'
import AuditService from './auditService'
import SessionService from './sessionService'
import ReferenceDataService from './referenceDataService'
import SupervisorService from './supervisorService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    sessionClient,
    appointmentClient,
    referenceDataClient,
    formClient,
    supervisorClient,
  } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    sessionService: new SessionService(sessionClient),
    appointmentService: new AppointmentService(appointmentClient),
    referenceDataService: new ReferenceDataService(referenceDataClient),
    appointmentStatusService: new AppointmentStatusService(formClient),
    supervisorService: new SupervisorService(supervisorClient),
  }
}

export type Services = ReturnType<typeof services>
