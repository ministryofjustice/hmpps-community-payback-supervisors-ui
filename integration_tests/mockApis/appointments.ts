import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import { AppointmentDto } from '../../server/@types/shared'

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
    userMessage,
  }: {
    appointment: AppointmentDto
    userMessage: string
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
          userMessage,
          developerMessage: 'Bad request',
        },
      },
    })
  },
}
