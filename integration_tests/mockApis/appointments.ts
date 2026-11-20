import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import { ApiResponseIssue, AppointmentDto, ErrorResponse } from '../../server/@types/shared'

export default {
  stubFindAppointment: ({ appointment }: { appointment: AppointmentDto }): SuperAgentRequest => {
    const pattern = paths.appointments.singleAppointment({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          ...appointment,
        },
      },
    })
  },

  stubUpdateAppointmentOutcome: ({ appointment }: { appointment: AppointmentDto }): SuperAgentRequest => {
    const pattern = paths.appointments.outcome({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
    return stubFor({
      request: {
        method: 'PUT',
        urlPathPattern: pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },

  stubUpdateAppointmentOutcomeWithError: ({
    appointment,
    errors = [],
    warnings = [],
  }: {
    appointment: AppointmentDto
    errors?: Array<ApiResponseIssue>
    warnings?: Array<ApiResponseIssue>
  }): SuperAgentRequest => {
    const pattern = paths.appointments.outcome({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
    return stubFor({
      request: {
        method: 'PUT',
        urlPathPattern: pattern,
      },
      response: {
        status: 400,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          status: 400,
          success: false,
          hasContent: false,
          hasErrors: errors.length > 0,
          hasWarnings: warnings.length > 0,
          errors,
          warnings,
          userMessage: errors[0]?.data.message ?? null,
          developerMessage: 'Bad request',
        } satisfies ErrorResponse,
      },
    })
  },
}
