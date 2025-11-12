import { dataAccess } from '../data'
import AuditService from './auditService'
import SessionService from './sessionService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, sessionClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    sessionService: new SessionService(sessionClient),
  }
}

export type Services = ReturnType<typeof services>
