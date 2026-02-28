import { FormKeyDto } from '../@types/shared'
import { AppointmentStatusType } from '../@types/user-defined'
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
      expect(result).toEqual(expectedStatus.status)
    })

    it.each([
      ['code', 'Not expected'],
      [null, 'Scheduled'],
      [undefined, 'Scheduled'],
    ])(
      'returns default appointment status does not exist on the session statuses list',
      async (contactOutcomeCode: string, status: AppointmentStatusType) => {
        const appointment = appointmentFactory.build({ contactOutcomeCode })
        const appointmentStatuses = appointmentStatusFactory.buildList(2)

        formClient.find.mockResolvedValue({ appointmentStatuses })

        const result = await appointmentStatusService.getStatus(appointment, userName)

        expect(result).toEqual(status)
      },
    )

    it.each([
      ['code', 'Not expected'],
      [null, 'Scheduled'],
      [undefined, 'Scheduled'],
    ])(
      'returns default appointment status if no status list exists for the session',
      async (contactOutcomeCode: string, status: AppointmentStatusType) => {
        const appointment = appointmentFactory.build({ contactOutcomeCode })

        formClient.find.mockResolvedValue(null)
        const result = await appointmentStatusService.getStatus(appointment, userName)

        expect(result).toEqual(status)
      },
    )
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

    describe('when appointment has existing status', () => {
      describe('and has a contact outcome', () => {
        it('returns the existing status', async () => {
          const appointmentSummary = appointmentSummaryFactory.build({ contactOutcome: contactOutcomeFactory.build() })
          const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

          const appointmentStatus = appointmentStatusFactory.build({
            appointmentId: appointmentSummary.id,
            status: 'Working',
          })

          formClient.find.mockResolvedValue({ appointmentStatuses: [appointmentStatus] })

          const result = await appointmentStatusService.getStatusesForSession(session, userName)

          expect(result).toEqual([
            {
              appointmentId: appointmentSummary.id,
              status: appointmentStatus.status,
            },
          ])
        })
      })
      describe('and does not have a contact outcome', () => {
        it('returns "Scheduled" status', async () => {
          const appointmentSummary = appointmentSummaryFactory.build({ contactOutcome: null })
          const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

          const appointmentStatus = appointmentStatusFactory.build({
            appointmentId: appointmentSummary.id,
            status: 'Working',
          })

          formClient.find.mockResolvedValue({ appointmentStatuses: [appointmentStatus] })

          const result = await appointmentStatusService.getStatusesForSession(session, userName)

          expect(result).toEqual([
            {
              appointmentId: appointmentSummary.id,
              status: 'Scheduled',
            },
          ])
        })
      })
    })

    describe('when appointment does not have an existing status', () => {
      describe('and has a contact outcome', () => {
        it('returns "Not expected" status', async () => {
          const appointmentSummary = appointmentSummaryFactory.build({ contactOutcome: contactOutcomeFactory.build() })
          const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

          formClient.find.mockResolvedValue({ appointmentStatuses: [] })

          const result = await appointmentStatusService.getStatusesForSession(session, userName)

          expect(result).toEqual([
            {
              appointmentId: appointmentSummary.id,
              status: 'Not expected',
            },
          ])
        })
      })
      describe('and does not have a contact outcome', () => {
        it('returns "Scheduled" status', async () => {
          const appointmentSummary = appointmentSummaryFactory.build({ contactOutcome: null })
          const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

          formClient.find.mockResolvedValue({ appointmentStatuses: [] })

          const result = await appointmentStatusService.getStatusesForSession(session, userName)

          expect(result).toEqual([
            {
              appointmentId: appointmentSummary.id,
              status: 'Scheduled',
            },
          ])
        })
      })
    })

    it('returns default statuses for any new appointments on a session', async () => {
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

      expect(result).toEqual(updatedStatuses)
    })

    it('calls form client with project code and date and returns default statuses if result is null', async () => {
      const appointmentSummary = appointmentSummaryFactory.build({ contactOutcome: null })
      const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

      formClient.find.mockResolvedValue(null)
      const result = await appointmentStatusService.getStatusesForSession(session, userName)

      const appointmentStatuses = [{ appointmentId: appointmentSummary.id, status: 'Scheduled' }]

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

    it('saves new status if given appointment status does not exist on the session statuses list', async () => {
      const status = 'Working'
      const appointment = appointmentFactory.build()
      const appointmentStatuses = appointmentStatusFactory.buildList(2)

      formClient.find.mockResolvedValue({ appointmentStatuses })

      const updatedStatuses = [...appointmentStatuses, { appointmentId: appointment.id, status }]
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: appointment.projectCode + appointment.date,
      }

      await appointmentStatusService.updateStatus(appointment, status, userName)

      expect(formClient.save).toHaveBeenCalledWith(expectedFormKey, userName, { appointmentStatuses: updatedStatuses })
    })

    it('saves new status if no status list exists for the session', async () => {
      const status = 'Working'
      const appointment = appointmentFactory.build()

      formClient.find.mockResolvedValue(null)
      const appointmentStatuses = [{ appointmentId: appointment.id, status }]
      const expectedFormKey: FormKeyDto = {
        type: APPOINTMENT_STATUS_FORM_TYPE,
        id: appointment.projectCode + appointment.date,
      }

      await appointmentStatusService.updateStatus(appointment, status, userName)

      expect(formClient.save).toHaveBeenCalledWith(expectedFormKey, userName, { appointmentStatuses })
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
