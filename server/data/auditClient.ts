import { auditService as hmppsAuditClient } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'
import { AuditParams } from '../@types/user-defined'

export interface AuditClientConfig {
  serviceName: string
  logErrors: boolean
  enabled: boolean
}

export default class AuditClient {
  private serviceName: string

  private logErrors: boolean

  private enabled: boolean

  constructor(config: AuditClientConfig) {
    this.serviceName = config.serviceName
    this.logErrors = config.logErrors
    this.enabled = config.enabled
  }

  async sendAuditMessage(auditParams: AuditParams) {
    if (!this.enabled) return

    const { action, username, subjectId, subjectType, correlationId, details } = auditParams

    const jsonDetails = JSON.stringify(details)

    try {
      logger.info(`Sending audit message ${action} (${jsonDetails})`)

      await hmppsAuditClient.sendAuditMessage({
        action,
        who: username,
        subjectId,
        subjectType,
        service: this.serviceName,
        correlationId,
        details: jsonDetails,
      })
    } catch (error) {
      if (this.logErrors) {
        logger.error('Problem sending audit message to HMPPS audit service', error)
      }
    }
  }
}
