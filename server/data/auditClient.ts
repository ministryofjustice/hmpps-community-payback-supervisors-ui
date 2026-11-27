import { AuditService, AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'
import { AuditParams } from '../@types/user-defined'

export interface AuditClientConfig {
  queueUrl: string
  region: string
  serviceName: string
  logErrors: boolean
  enabled: boolean
}

export default class AuditClient {
  private hmppsAuditService: AuditService<string, string>

  private logErrors: boolean

  private enabled: boolean

  constructor(config: AuditClientConfig) {
    const { queueUrl, region, serviceName, enabled } = config

    this.logErrors = config.logErrors
    this.enabled = enabled
    this.hmppsAuditService = AuditServiceFactory.createInstance<string, string>(
      { queueUrl, region, serviceName, enabled },
      logger,
    )
  }

  async sendAuditMessage(auditParams: AuditParams) {
    if (!this.enabled) return

    const { action, username, subjectId, subjectType, correlationId, details } = auditParams

    logger.info(`Sending audit message ${action} (${JSON.stringify(details)})`)

    await this.hmppsAuditService.logAuditEvent(
      {
        what: action,
        who: username,
        subjectId,
        subjectType,
        correlationId,
        details,
      },
      { logOnError: this.logErrors, throwOnError: false },
    )
  }
}
