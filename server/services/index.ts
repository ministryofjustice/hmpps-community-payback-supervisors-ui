import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import AuditService from './auditService'
import SessionService from './sessionService'
import ReferenceDataService from './referenceDataService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, sessionClient, appointmentClient, referenceDataClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    sessionService: new SessionService(sessionClient),
    appointmentService: new AppointmentService(appointmentClient),
    referenceDataService: new ReferenceDataService(referenceDataClient),
  }
}

export type Services = ReturnType<typeof services>
