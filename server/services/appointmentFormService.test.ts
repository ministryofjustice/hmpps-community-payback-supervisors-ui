import FormClient from '../data/formClient'
import appointmentFactory from '../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../testutils/factories/appointmentOutcomeFormFactory'
import AppointmentFormService, { APPOINTMENT_UPDATE_FORM_TYPE } from './appointmentFormService'

const newId = 'a-random-string-uuid-'

jest.mock('../data/formClient')
jest.mock('crypto', () => {
  return {
    randomUUID: () => newId,
  }
})

describe('AppointmentFormService', () => {
  const type = 'APPOINTMENT_UPDATE_SUPERVISOR'
  const formClient = new FormClient(null) as jest.Mocked<FormClient>
  let appointmentFormService: AppointmentFormService

  beforeEach(() => {
    jest.resetAllMocks()
    appointmentFormService = new AppointmentFormService(formClient)
  })

  describe('getForm', () => {
    it('should fetch form', async () => {
      const formResult = appointmentOutcomeFormFactory.build()

      formClient.find.mockResolvedValue(formResult)

      const result = await appointmentFormService.getForm('1', 'some-name')

      expect(formClient.find).toHaveBeenCalledTimes(1)
      expect(result).toEqual(formResult)
    })
  })

  describe('saveForm', () => {
    it('should save form with provided id and body', async () => {
      const form = appointmentOutcomeFormFactory.build()

      await appointmentFormService.saveForm('1', 'some-name', form)
      expect(formClient.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('createForm', () => {
    it('should return form with new id and appointment data', async () => {
      const user = 'some-user'
      const appointment = appointmentFactory.build()
      const result = await appointmentFormService.createForm(appointment, user)

      const expectedForm = {
        deliusVersion: appointment.version,
        endTime: appointment.endTime,
      }

      expect(formClient.save).toHaveBeenCalledWith(
        { id: newId, type: APPOINTMENT_UPDATE_FORM_TYPE },
        user,
        expectedForm,
      )
      expect(result).toEqual({
        key: {
          id: newId,
          type,
        },
        data: expectedForm,
      })
    })
  })

  describe('getFormKey', () => {
    it('should return a form key object given an ID', () => {
      const result = appointmentFormService.getFormKey('some-id')
      expect(result).toEqual({
        id: 'some-id',
        type,
      })
    })
  })
})
