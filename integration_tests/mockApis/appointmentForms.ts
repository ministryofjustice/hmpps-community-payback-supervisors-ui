import { SuperAgentRequest } from 'superagent'
import { AppointmentOutcomeForm } from '../../server/@types/user-defined'
import { APPOINTMENT_UPDATE_FORM_TYPE } from '../../server/services/appointmentFormService'
import { stubFor } from './wiremock'

export default {
  stubGetAppointmentForm: (form: AppointmentOutcomeForm): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: `/common/forms/${APPOINTMENT_UPDATE_FORM_TYPE}/([a-f0-9\\-]*)`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: form,
      },
    }),
  stubSaveAppointmentForm: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PUT',
        urlPathPattern: `/common/forms/${APPOINTMENT_UPDATE_FORM_TYPE}/([a-f0-9\\-]*)`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    }),
}
