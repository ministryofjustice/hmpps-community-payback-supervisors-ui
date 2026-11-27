import { AuditService, AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import AuditClient, { AuditClientConfig } from './auditClient'
import logger from '../../logger'

jest.mock('@ministryofjustice/hmpps-audit-client')

describe('AuditClient', () => {
  const config: AuditClientConfig = {
    queueUrl: 'http://localhost:4566/000000000000/mainQueue',
    region: 'eu-west-2',
    serviceName: 'hmpps-community-payback-supervisors-ui',
    logErrors: true,
    enabled: true,
  }

  const auditParams = {
    action: 'AUDIT_EVENT',
    username: 'user1',
    subjectId: 'X123456',
    subjectType: 'CRN',
    correlationId: 'request123',
    details: { extraDetails: 'example' },
  }

  let hmppsAuditService: jest.Mocked<AuditService<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    hmppsAuditService = { logAuditEvent: jest.fn() } as unknown as jest.Mocked<AuditService<string, string>>
    jest.mocked(AuditServiceFactory.createInstance).mockReturnValue(hmppsAuditService)
  })

  it('creates the HMPPS audit service from the config', () => {
    new AuditClient(config) // eslint-disable-line no-new

    expect(AuditServiceFactory.createInstance).toHaveBeenCalledWith(
      {
        queueUrl: config.queueUrl,
        region: config.region,
        serviceName: config.serviceName,
        enabled: true,
      },
      logger,
    )
  })

  it('sends the audit message without throwing on error', async () => {
    await new AuditClient(config).sendAuditMessage(auditParams)

    expect(hmppsAuditService.logAuditEvent).toHaveBeenCalledWith(
      {
        what: 'AUDIT_EVENT',
        who: 'user1',
        subjectId: 'X123456',
        subjectType: 'CRN',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      },
      { logOnError: true, throwOnError: false },
    )
  })

  it('does not send the audit message when disabled', async () => {
    await new AuditClient({ ...config, enabled: false }).sendAuditMessage(auditParams)

    expect(hmppsAuditService.logAuditEvent).not.toHaveBeenCalled()
  })
})
