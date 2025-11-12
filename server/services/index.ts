import { dataAccess } from '../data'
import AppointmentService from './appointmentService'
import AuditService from './auditService'
import SessionService from './sessionService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, sessionClient, appointmentClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    sessionService: new SessionService(sessionClient),
    appointmentService: new AppointmentService(appointmentClient),
  }
}

export type Services = ReturnType<typeof services>
