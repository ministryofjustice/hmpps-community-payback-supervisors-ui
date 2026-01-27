import { randomUUID } from 'crypto'
import { AppointmentDto, FormKeyDto } from '../@types/shared'
import { AppointmentOutcomeForm } from '../@types/user-defined'
import FormClient from '../data/formClient'

export const APPOINTMENT_UPDATE_FORM_TYPE = 'APPOINTMENT_UPDATE_SUPERVISOR'

export interface Form {
  key: FormKeyDto
  data: AppointmentOutcomeForm
}

export default class AppointmentFormService {
  constructor(private readonly formClient: FormClient) {}

  getForm(formId: string, username: string): Promise<AppointmentOutcomeForm> {
    const formKey = this.getFormKey(formId)
    return this.formClient.find<AppointmentOutcomeForm>(formKey, username)
  }

  async saveForm(formId: string, username: string, data: AppointmentOutcomeForm) {
    const formKey = this.getFormKey(formId)

    return this.formClient.save(formKey, username, data)
  }

  async createForm(appointment: AppointmentDto, username: string): Promise<Form> {
    const form = {
      key: this.getFormKey(randomUUID()),
      data: {
        // we will only persist values in the `Finish session` pages of the form
        // setting notes and contact outcome as undefined as these should be entered from scratch in the app
        // attendance data does not need to be saved as we will submit at the time of selection
        deliusVersion: appointment.version,
        endTime: appointment.endTime,
      },
    }

    await this.saveForm(form.key.id, username, form.data)

    return form
  }

  getFormKey(id: string): FormKeyDto {
    return {
      id,
      type: APPOINTMENT_UPDATE_FORM_TYPE,
    }
  }
}
