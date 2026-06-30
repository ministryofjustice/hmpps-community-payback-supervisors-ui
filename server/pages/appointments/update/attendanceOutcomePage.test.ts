import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import { contactOutcomeFactory, contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import AttendanceOutcomePage, { AttendanceOutcomeBody } from './attendanceOutcomePage'
import * as Utils from '../../../utils/utils'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'

jest.mock('../../../models/offender')

describe('AttendanceOutcomePage', () => {
  const { contactOutcomes } = contactOutcomesFactory.build({
    contactOutcomes: [
      contactOutcomeFactory.build({ code: 'ATTC' }),
      contactOutcomeFactory.build({ code: 'ATSH' }),
      contactOutcomeFactory.build({ code: 'ATSS' }),
    ],
  })
  const appointment = appointmentFactory.build({ sensitive: undefined })

  const pathWithQuery = '/path?'

  beforeEach(() => {
    jest.spyOn(Utils, 'pathWithQuery').mockReturnValue(pathWithQuery)
  })

  describe('validationErrors', () => {
    it('returns error when attendance outcome is empty', () => {
      const page = new AttendanceOutcomePage({ query: {} as AttendanceOutcomeBody, appointment, contactOutcomes })
      page.validate()

      expect(page.validationErrors).toEqual({
        attendanceOutcome: { text: 'Select an attendance outcome' },
      })
    })
  })

  describe('viewData', () => {
    it('should render the attendance outcome page', async () => {
      const formWithOutcomes = appointmentOutcomeFormFactory.build({
        contactOutcomeCode: contactOutcomes[0].code,
      })
      const page = new AttendanceOutcomePage({
        query: {} as AttendanceOutcomeBody,
        appointment,
        contactOutcomes,
      })
      const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }
      offenderMock.mockImplementation(() => {
        return offender
      })

      const expectedItems = [
        {
          text: contactOutcomes[0].name,
          value: contactOutcomes[0].code,
          checked: true,
        },
        {
          text: contactOutcomes[1].name,
          value: contactOutcomes[1].code,
          checked: false,
        },
        {
          text: contactOutcomes[2].name,
          value: contactOutcomes[2].code,
          checked: false,
        },
      ]

      jest.spyOn(paths.appointments, 'attendanceOutcome')

      const result = page.viewData(formWithOutcomes)

      expect(paths.appointments.attendanceOutcome).toHaveBeenCalledWith({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      })

      expect(result).toEqual({
        offender,
        items: expectedItems,
        updatePath: pathWithQuery,
        backPath: paths.appointments.show({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        }),
        form: undefined,
      })
    })

    describe('items', () => {
      it('should map contact outcome value as selected if no errors', () => {
        const form = appointmentOutcomeFormFactory.build({
          contactOutcomeCode: contactOutcomes[0].code,
        })
        const page = new AttendanceOutcomePage({
          query: { attendanceOutcome: contactOutcomes[1].code },
          appointment,
          contactOutcomes,
        })

        const result = page.viewData(form)

        const expectedItems = [
          {
            text: contactOutcomes[0].name,
            value: contactOutcomes[0].code,
            checked: true,
          },
          {
            text: contactOutcomes[1].name,
            value: contactOutcomes[1].code,
            checked: false,
          },
          {
            text: contactOutcomes[2].name,
            value: contactOutcomes[2].code,
            checked: false,
          },
        ]

        expect(result.items).toEqual(expectedItems)
      })

      it('should include hint text when a contact outcome defines it', () => {
        const outcomes = contactOutcomesFactory.build({
          contactOutcomes: [
            contactOutcomeFactory.build({ code: 'ATTC', hintText: 'foo' }),
            contactOutcomeFactory.build({ code: 'ATSH' }),
            contactOutcomeFactory.build({ code: 'ATSS' }),
          ],
        })

        const hintedOutcome = outcomes.contactOutcomes[0]
        const nonHintedOutcome = outcomes.contactOutcomes[1]

        const form = appointmentOutcomeFormFactory.build({
          contactOutcomeCode: hintedOutcome.code,
        })
        const page = new AttendanceOutcomePage({
          query: {},
          appointment,
          contactOutcomes: outcomes.contactOutcomes,
        })

        const result = page.viewData(form)

        expect(result.items[0]).toEqual({
          text: hintedOutcome.name,
          value: hintedOutcome.code,
          hint: { text: hintedOutcome.hintText },
          checked: true,
        })

        expect(result.items[1]).toEqual({
          text: nonHintedOutcome.name,
          value: nonHintedOutcome.code,
          hint: undefined,
          checked: false,
        })
      })

      it('should return query values if there are errors', () => {
        const page = new AttendanceOutcomePage({
          query: { attendanceOutcome: null },
          appointment,
          contactOutcomes,
        })

        const result = page.viewData(appointmentOutcomeFormFactory.build(), true)

        const expectedItems = [
          {
            text: contactOutcomes[0].name,
            value: contactOutcomes[0].code,
            checked: false,
          },
          {
            text: contactOutcomes[1].name,
            value: contactOutcomes[1].code,
            checked: false,
          },
          {
            text: contactOutcomes[2].name,
            value: contactOutcomes[2].code,
            checked: false,
          },
        ]

        expect(result.items).toEqual(expectedItems)
      })

      it('should return items if page has Errors and contact outcome is undefined', () => {
        const page = new AttendanceOutcomePage({
          query: {},
          appointment,
          contactOutcomes,
        })
        page.validate()

        const result = page.viewData(appointmentOutcomeFormFactory.build())

        const expectedItems = [
          {
            text: contactOutcomes[0].name,
            value: contactOutcomes[0].code,
            checked: false,
          },
          {
            text: contactOutcomes[1].name,
            value: contactOutcomes[1].code,
            checked: false,
          },
          {
            text: contactOutcomes[2].name,
            value: contactOutcomes[2].code,
            checked: false,
          },
        ]

        expect(result.items).toEqual(expectedItems)
      })
    })
  })

  describe('nextPath', () => {
    it('should return log hours link with given appointmentId', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const path = '/path'

      const attendedOutcome = contactOutcomeFactory.build({ attended: true })

      const page = new AttendanceOutcomePage({
        query: { attendanceOutcome: attendedOutcome.code },
        appointment,
        contactOutcomes: contactOutcomesFactory.build({ contactOutcomes: [attendedOutcome] }).contactOutcomes,
      })

      jest.spyOn(paths.appointments.arrived, 'startTime').mockReturnValue(path)

      expect(page.nextPath(projectCode, appointmentId)).toBe(pathWithQuery)
      expect(paths.appointments.arrived.startTime).toHaveBeenCalledWith({ projectCode, appointmentId })
    })
  })
})
