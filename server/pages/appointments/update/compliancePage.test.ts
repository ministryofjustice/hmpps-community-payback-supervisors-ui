import { AppointmentDto } from '../../../@types/shared'
import { AppointmentCompletedAction, GovUkRadioOption } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import CompliancePage, { ComplianceQuery } from './compliancePage'

jest.mock('../../../models/offender')

describe('CompliancePage', () => {
  let page: CompliancePage
  let appointment: AppointmentDto

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    beforeEach(() => {
      page = new CompliancePage('completed', {})
      appointment = appointmentFactory.build()
    })

    it('should return an object containing offender', () => {
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const result = page.viewData(appointment)

      expect(result.offender).toBe(offender)
    })

    it.each(['completed', 'leftEarly'])(
      'should return an object containing a back link to the end time page',
      async (action: AppointmentCompletedAction) => {
        page = new CompliancePage(action, {})
        const result = page.viewData(appointment)
        expect(result.backPath).toBe(
          paths.appointments[action].endTime({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          }),
        )
      },
    )

    it.each(['completed', 'leftEarly'])(
      'should return an object containing an update link for the form',
      async (action: AppointmentCompletedAction) => {
        page = new CompliancePage(action, {})
        const result = page.viewData(appointment)
        expect(result.updatePath).toBe(
          paths.appointments[action].compliance({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          }),
        )
      },
    )

    describe('items', () => {
      it('should return items for hiVis', async () => {
        const items = ['items'] as unknown as GovUkRadioOption[]
        jest.spyOn(GovUkRadioGroup, 'yesNoItems').mockReturnValue(items)

        const result = page.viewData(appointment)
        expect(result.hiVisItems).toEqual(items)
      })

      it('should return items for workedIntensively', async () => {
        const items = ['items'] as unknown as GovUkRadioOption[]
        jest.spyOn(GovUkRadioGroup, 'yesNoItems').mockReturnValue(items)

        const result = page.viewData(appointment)
        expect(result.workedIntensivelyItems).toEqual(items)
      })

      it('should return empty notes', async () => {
        const result = page.viewData(appointment)
        expect(result.notes).toEqual(null)
      })

      describe('workQuality', () => {
        it('should return items for workQuality without checked answer', async () => {
          appointment = appointmentFactory.build({ attendanceData: { workQuality: null } })

          const result = page.viewData(appointment)
          expect(result.workQualityItems).toEqual([
            { text: 'Excellent', value: 'EXCELLENT', checked: false },
            { text: 'Good', value: 'GOOD', checked: false },
            { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
            { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
            { text: 'Poor', value: 'POOR', checked: false },
            { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
          ])
        })

        it('should return items for workQuality with checked answer', async () => {
          appointment = appointmentFactory.build({ attendanceData: { workQuality: 'GOOD' } })

          const result = page.viewData(appointment)
          expect(result.workQualityItems).toEqual([
            { text: 'Excellent', value: 'EXCELLENT', checked: false },
            { text: 'Good', value: 'GOOD', checked: true },
            { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
            { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
            { text: 'Poor', value: 'POOR', checked: false },
            { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
          ])
        })
      })

      describe('behaviour', () => {
        it('should return items for behaviour without checked answer', async () => {
          appointment = appointmentFactory.build({ attendanceData: { behaviour: null } })

          const result = page.viewData(appointment)
          expect(result.behaviourItems).toEqual([
            { text: 'Excellent', value: 'EXCELLENT', checked: false },
            { text: 'Good', value: 'GOOD', checked: false },
            { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
            { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
            { text: 'Poor', value: 'POOR', checked: false },
            { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
          ])
        })

        it('should return items for behaviour with checked answer', async () => {
          appointment = appointmentFactory.build({ attendanceData: { behaviour: 'UNSATISFACTORY' } })

          const result = page.viewData(appointment)
          expect(result.behaviourItems).toEqual([
            { text: 'Excellent', value: 'EXCELLENT', checked: false },
            { text: 'Good', value: 'GOOD', checked: false },
            { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
            { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: true },
            { text: 'Poor', value: 'POOR', checked: false },
            { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
          ])
        })
      })
    })
  })

  describe('validate', () => {
    const action = 'completed'
    describe('when hiVis is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, { hiVis: null })
        page.validate()

        expect(page.validationErrors.hiVis).toEqual({
          text: 'Select whether a Hi-Vis was worn',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when workedIntensively is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, { workedIntensively: null })
        page.validate()

        expect(page.validationErrors.workedIntensively).toEqual({
          text: 'Select whether they worked intensively',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when workQuality is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, { workQuality: null })
        page.validate()

        expect(page.validationErrors.workQuality).toEqual({
          text: 'Select their work quality',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when behaviour is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, { behaviour: null })
        page.validate()

        expect(page.validationErrors.behaviour).toEqual({
          text: 'Select their behaviour',
        })
        expect(page.hasErrors).toBe(true)
      })
    })
  })

  describe('next', () => {
    it.each(['completed', 'leftEarly'])('should return confirm page link', (action: AppointmentCompletedAction) => {
      const appointmentId = '1'
      const projectCode = '2'
      page = new CompliancePage(action, {})

      expect(page.nextPath(projectCode, appointmentId)).toBe(
        paths.appointments.confirm.completed({ projectCode, appointmentId }),
      )
    })
  })

  describe('requestBody', () => {
    const action = 'completed'
    beforeEach(() => {
      appointment = appointmentFactory.build()
      jest.spyOn(GovUkRadioGroup, 'valueFromYesOrNoItem').mockReturnValue(false)
    })

    it('updates and returns data from query given empty object', () => {
      const query: ComplianceQuery = {
        hiVis: 'no',
        workedIntensively: 'no',
        workQuality: 'EXCELLENT',
        behaviour: 'GOOD',
        notes: 'good',
      }

      page = new CompliancePage(action, query)

      const result = page.requestBody(appointment)

      expect(result).toEqual(
        expect.objectContaining({
          attendanceData: expect.objectContaining({
            hiVisWorn: false,
            workedIntensively: false,
            workQuality: 'EXCELLENT',
            behaviour: 'GOOD',
          }),
          notes: 'good',
        }),
      )
    })

    it('updates and returns data from query given object with existing data', () => {
      appointment = appointmentFactory.build({ startTime: '10:00', attendanceData: { penaltyTime: '01:00' } })
      const query: ComplianceQuery = {
        hiVis: 'no',
        workedIntensively: 'no',
        workQuality: 'EXCELLENT',
        behaviour: 'GOOD',
        notes: 'good',
      }

      page = new CompliancePage(action, query)

      const result = page.requestBody(appointment)

      expect(result).toEqual(
        expect.objectContaining({
          startTime: '10:00',
          attendanceData: expect.objectContaining({
            penaltyTime: '01:00',
            hiVisWorn: false,
            workedIntensively: false,
            workQuality: 'EXCELLENT',
            behaviour: 'GOOD',
          }),
          notes: 'good',
        }),
      )
    })
  })
})
