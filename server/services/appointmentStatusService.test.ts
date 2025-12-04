import { FormKeyDto } from '../@types/shared'
import config from '../config'
import FormClient from '../data/formClient'
import appointmentFactory from '../testutils/factories/appointmentFactory'
import appointmentStatusFactory from '../testutils/factories/appointmentStatusFactory'
import appointmentSummaryFactory from '../testutils/factories/appointmentSummaryFactory'
import { contactOutcomeFactory } from '../testutils/factories/contactOutcomeFactory'
import sessionFactory from '../testutils/factories/sessionFactory'
import AppointmentStatusService, { APPOINTMENT_STATUS_FORM_TYPE } from './appointmentStatusService'

jest.mock('../data/formClient')
jest.mock('../config')

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

      const newAppointment = appointmentSummaryFactory.build({ contactOutcome: null })
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

    it('changes any scheduled statuses to not expected if they have a contact outcome', async () => {
      const appointmentSummaries = appointmentSummaryFactory.buildList(2, {
        contactOutcome: contactOutcomeFactory.build(),
      })
      const session = sessionFactory.build({ appointmentSummaries })
      const appointmentStatuses = appointmentSummaries.map(appointment =>
        appointmentStatusFactory.build({ appointmentId: appointment.id, status: 'Scheduled' }),
      )

      formClient.find.mockResolvedValue({ appointmentStatuses })

      const result = await appointmentStatusService.getStatusesForSession(session, userName)
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: session.projectCode + session.date,
      }

      const updatedStatuses = appointmentStatuses.map(status => ({ ...status, status: 'Not expected' }))

      expect(formClient.find).toHaveBeenCalledWith(expectedFormKey, userName)
      expect(formClient.save).toHaveBeenCalledWith(expectedFormKey, userName, { appointmentStatuses: updatedStatuses })

      expect(result).toEqual(updatedStatuses)
    })

    it('does not change any statuses if no changes', async () => {
      const appointmentSummaries = appointmentSummaryFactory.buildList(2, {
        contactOutcome: null,
      })
      const session = sessionFactory.build({ appointmentSummaries })
      const appointmentStatuses = appointmentSummaries.map(appointment =>
        appointmentStatusFactory.build({ appointmentId: appointment.id }),
      )

      formClient.find.mockResolvedValue({ appointmentStatuses })

      const result = await appointmentStatusService.getStatusesForSession(session, userName)
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: session.projectCode + session.date,
      }

      expect(formClient.find).toHaveBeenCalledWith(expectedFormKey, userName)
      expect(formClient.save).not.toHaveBeenCalled()

      expect(result).toEqual(appointmentStatuses)
    })

    it('calls form client with project code and date and saves new form if result is null', async () => {
      const appointmentSummary = appointmentSummaryFactory.build({ contactOutcome: null })
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

  describe('updateStatus', () => {
    it('updates an existing appointment status for a session', async () => {
      const appointment = appointmentFactory.build()
      const appointmentStatus = { appointmentId: appointment.id, status: 'Scheduled' }
      const otherStatuses = appointmentStatusFactory.buildList(2)
      const appointmentStatuses = [...otherStatuses, appointmentStatus]

      formClient.find.mockResolvedValue({ appointmentStatuses })

      await appointmentStatusService.updateStatus(appointment, 'Working', userName)

      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: appointment.projectCode + appointment.date,
      }

      expect(formClient.save).toHaveBeenCalledWith(expectedFormKey, userName, {
        appointmentStatuses: [...otherStatuses, { appointmentId: appointment.id, status: 'Working' }],
      })
    })

    it('throws an error if given appointment status does not exist on the session statuses list', async () => {
      const appointment = appointmentFactory.build()
      const appointmentStatuses = appointmentStatusFactory.buildList(2)

      formClient.find.mockResolvedValue({ appointmentStatuses })

      expect(() => appointmentStatusService.updateStatus(appointment, 'Working', userName)).rejects.toThrow(
        `No appointment status found for project ${appointment.projectCode} on ${appointment.date}`,
      )
    })

    it('throws an error if no status list exists for the session', async () => {
      const appointment = appointmentFactory.build()

      formClient.find.mockResolvedValue(null)
      expect(() => appointmentStatusService.updateStatus(appointment, 'Working', userName)).rejects.toThrow(
        `No appointment status found for project ${appointment.projectCode} on ${appointment.date}`,
      )
    })
  })

  describe('clearStatusesForSession', () => {
    it('calls form client with project code and date', async () => {
      config.flags = {
        enableClearSessionStatuses: true,
      }
      const session = sessionFactory.build()

      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: session.projectCode + session.date,
      }

      await appointmentStatusService.clearStatusesForSession(session.projectCode, session.date, userName)

      expect(formClient.clear).toHaveBeenCalledWith(expectedFormKey, userName)
    })

    it('throws error if feature flag not enabled', async () => {
      config.flags = {
        enableClearSessionStatuses: false,
      }
      const session = sessionFactory.build()

      expect(() =>
        appointmentStatusService.clearStatusesForSession(session.projectCode, session.date, 'some-user'),
      ).rejects.toThrow('Clearing session statuses not enabled')
    })
  })
})
