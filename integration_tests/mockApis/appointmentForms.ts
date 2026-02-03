import { SuperAgentRequest } from 'superagent'
import { AppointmentOutcomeForm } from '../../server/@types/user-defined'
import { APPOINTMENT_UPDATE_FORM_TYPE } from '../../server/services/appointmentFormService'
import { stubFor } from './wiremock'

export default {
  stubGetAppointmentForm: ({ form, formId }: { form: AppointmentOutcomeForm; formId?: string }): SuperAgentRequest => {
    const request: { method: string; urlPath?: string; urlPathPattern?: string } = {
      method: 'GET',
    }
    if (formId) {
      request.urlPath = `/common/forms/${APPOINTMENT_UPDATE_FORM_TYPE}/${formId}`
    } else {
      request.urlPathPattern = `/common/forms/${APPOINTMENT_UPDATE_FORM_TYPE}/([a-f0-9\\-]*)`
    }
    return stubFor({
      request,
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: form,
      },
    })
  },
  stubSaveAppointmentForm: (args?: { formId?: string }): SuperAgentRequest => {
    const request: { method: string; urlPath?: string; urlPathPattern?: string } = {
      method: 'PUT',
    }
    if (args?.formId) {
      request.urlPath = `/common/forms/${APPOINTMENT_UPDATE_FORM_TYPE}/${args.formId}`
    } else {
      request.urlPathPattern = `/common/forms/${APPOINTMENT_UPDATE_FORM_TYPE}/([a-f0-9\\-]*)`
    }
    return stubFor({
      request,
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },
}
