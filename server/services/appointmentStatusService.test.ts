import { FormKeyDto } from '../@types/shared'
import FormClient from '../data/formClient'
import appointmentFactory from '../testutils/factories/appointmentFactory'
import appointmentStatusFactory from '../testutils/factories/appointmentStatusFactory'
import appointmentSummaryFactory from '../testutils/factories/appointmentSummaryFactory'
import sessionFactory from '../testutils/factories/sessionFactory'
import AppointmentStatusService, { APPOINTMENT_STATUS_FORM_TYPE } from './appointmentStatusService'

jest.mock('../data/formClient')

describe('AppointmentStatusService', () => {
  const formClient = new FormClient(null) as jest.Mocked<FormClient>
  const userName = 'some-user'
  let appointmentStatusService: AppointmentStatusService

  beforeEach(() => {
    appointmentStatusService = new AppointmentStatusService(formClient)
    jest.resetAllMocks()
  })

  describe('getStatus', () => {
    it('finds an existing appointment status for a session', async () => {
      const appointment = appointmentFactory.build()
      const expectedStatus = appointmentStatusFactory.build({ appointmentId: appointment.id })
      const appointmentStatuses = [...appointmentStatusFactory.buildList(2), expectedStatus]

      formClient.find.mockResolvedValue({ appointmentStatuses })

      const result = await appointmentStatusService.getStatus(appointment, userName)
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: appointment.projectCode + appointment.date,
      }

      expect(formClient.find).toHaveBeenCalledWith(expectedFormKey, userName)
      expect(result).toEqual(expectedStatus)
    })

    it('throws an error if given appointment status does not exist on the session statuses list', async () => {
      const appointment = appointmentFactory.build()
      const appointmentStatuses = appointmentStatusFactory.buildList(2)

      formClient.find.mockResolvedValue({ appointmentStatuses })

      expect(() => appointmentStatusService.getStatus(appointment, userName)).rejects.toThrow(
        `No appointment status found for project ${appointment.projectCode} on ${appointment.date}`,
      )
    })

    it('throws an error if no status list exists for the session', async () => {
      const appointment = appointmentFactory.build()

      formClient.find.mockResolvedValue(null)
      expect(() => appointmentStatusService.getStatus(appointment, userName)).rejects.toThrow(
        `No appointment status found for project ${appointment.projectCode} on ${appointment.date}`,
      )
    })
  })

  describe('getStatusesForSession', () => {
    it('calls form client with project code and date and returns existing status values', async () => {
      const session = sessionFactory.build()
      const appointmentStatuses = session.appointmentSummaries.map(appointment =>
        appointmentStatusFactory.build({ appointmentId: appointment.id }),
      )

      formClient.find.mockResolvedValue({ appointmentStatuses })

      const result = await appointmentStatusService.getStatusesForSession(session, userName)
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: session.projectCode + session.date,
      }

      expect(formClient.find).toHaveBeenCalledWith(expectedFormKey, userName)
      expect(result).toEqual(appointmentStatuses)
    })

    it('creates new statuses for any new appointments on a session', async () => {
      const session = sessionFactory.build()
      const appointmentStatuses = session.appointmentSummaries.map(appointment =>
        appointmentStatusFactory.build({ appointmentId: appointment.id }),
      )
      formClient.find.mockResolvedValue({ appointmentStatuses })

      const newAppointment = appointmentSummaryFactory.build()
      session.appointmentSummaries.push(newAppointment)
      const updatedStatuses = [...appointmentStatuses, { appointmentId: newAppointment.id, status: 'Scheduled' }]

      const result = await appointmentStatusService.getStatusesForSession(session, userName)
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: session.projectCode + session.date,
      }

      expect(formClient.find).toHaveBeenCalledWith(expectedFormKey, userName)
      expect(formClient.save).toHaveBeenCalledWith(expectedFormKey, userName, { appointmentStatuses: updatedStatuses })

      expect(result).toEqual(updatedStatuses)
    })

    it('calls form client with project code and date and saves new form if result is null', async () => {
      const appointmentSummary = appointmentSummaryFactory.build()
      const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

      formClient.find.mockResolvedValue(null)
      const result = await appointmentStatusService.getStatusesForSession(session, userName)
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: session.projectCode + session.date,
      }

      const appointmentStatuses = [{ appointmentId: appointmentSummary.id, status: 'Scheduled' }]

      expect(formClient.save).toHaveBeenCalledWith(expectedFormKey, userName, { appointmentStatuses })
      expect(result).toEqual(appointmentStatuses)
    })
  })
})
