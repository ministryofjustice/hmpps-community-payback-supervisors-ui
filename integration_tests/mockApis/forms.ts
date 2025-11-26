import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { AppointmentStatus, APPOINTMENT_STATUS_FORM_TYPE } from '../../server/services/appointmentStatusService'
import { SessionDto } from '../../server/@types/shared'

export default {
  stubGetForm: ({
    session,
    appointmentStatuses,
  }: {
    session: SessionDto
    appointmentStatuses: AppointmentStatus[]
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/common/forms/${APPOINTMENT_STATUS_FORM_TYPE}/${session.projectCode}${session.date}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { appointmentStatuses },
      },
    }),
  stubGetFormNotFound: ({ session }: { session: SessionDto }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/common/forms/${APPOINTMENT_STATUS_FORM_TYPE}/${session.projectCode}${session.date}`,
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    }),
  stubSaveForm: ({ session }: { session: SessionDto }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PUT',
        urlPath: `/common/forms/${APPOINTMENT_STATUS_FORM_TYPE}/${session.projectCode}${session.date}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    }),
}
