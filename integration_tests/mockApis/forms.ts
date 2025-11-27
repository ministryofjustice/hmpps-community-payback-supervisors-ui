import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import { AppointmentStatus, APPOINTMENT_STATUS_FORM_TYPE } from '../../server/services/appointmentStatusService'
import { AppointmentDto, SessionDto } from '../../server/@types/shared'

export default {
  stubGetForm: ({
    sessionOrAppointment,
    appointmentStatuses,
  }: {
    sessionOrAppointment: Pick<SessionDto | AppointmentDto, 'projectCode' | 'date'>
    appointmentStatuses: AppointmentStatus[]
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/common/forms/${APPOINTMENT_STATUS_FORM_TYPE}/${sessionOrAppointment.projectCode}${sessionOrAppointment.date}`,
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
  stubSaveForm: ({
    sessionOrAppointment,
  }: {
    sessionOrAppointment: Pick<SessionDto | AppointmentDto, 'projectCode' | 'date'>
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PUT',
        urlPath: `/common/forms/${APPOINTMENT_STATUS_FORM_TYPE}/${sessionOrAppointment.projectCode}${sessionOrAppointment.date}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    }),
}
