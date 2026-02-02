import { AppointmentDto } from '../../../@types/shared'
import { AppointmentCompletedAction, AppointmentStatusType, GovUkRadioOption } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import CompliancePage, { ComplianceQuery } from './compliancePage'

jest.mock('../../../models/offender')

describe('CompliancePage', () => {
  let page: CompliancePage
  let appointment: AppointmentDto

  const contactOutcomeCode = 'XXXX'
  const formId = '12'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    beforeEach(() => {
      page = new CompliancePage('completed', formId, {}, contactOutcomeCode)
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

    describe('backPath', () => {
      it('should be to endTime if action is "completed"', () => {
        page = new CompliancePage('completed', formId, {}, contactOutcomeCode)
        const result = page.viewData(appointment)
        expect(result.backPath).toBe(
          `${paths.appointments.completed.endTime({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          })}?form=${formId}`,
        )
      })

      it('should be to reason page if action is "leftEarly"', () => {
        page = new CompliancePage('leftEarly', formId, {}, contactOutcomeCode)
        const result = page.viewData(appointment)
        expect(result.backPath).toBe(
          `${paths.appointments.leftEarly.reason({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          })}?form=${formId}`,
        )
      })
    })

    it.each(['completed', 'leftEarly'])(
      'should return an object containing an update link for the form',
      async (action: AppointmentCompletedAction) => {
        page = new CompliancePage(action, formId, {}, contactOutcomeCode)
        const result = page.viewData(appointment)
        expect(result.updatePath).toBe(
          `${paths.appointments[action].compliance({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
            contactOutcomeCode,
          })}?form=${formId}`,
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

      it('should return items for workQuality', async () => {
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

      it('should return items for behaviour', async () => {
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

      describe('populated form data', () => {
        it('should populate with query values if query exists', () => {
          const radioItems = [{ text: 'yes', value: 'yes', checked: true }]
          jest.spyOn(GovUkRadioGroup, 'yesNoItems').mockReturnValue(radioItems)
          const query: ComplianceQuery = {
            hiVis: 'yes',
            workedIntensively: 'no',
            workQuality: null,
            behaviour: 'GOOD',
            notes: 'note',
          }

          appointment = appointmentFactory.build({
            attendanceData: { hiVisWorn: null, workedIntensively: true, workQuality: 'GOOD', behaviour: 'EXCELLENT' },
            notes: 'some note',
          })

          page = new CompliancePage('completed', formId, query, contactOutcomeCode)
          const result = page.viewData(appointment)

          expect(GovUkRadioGroup.yesNoItems).toHaveBeenNthCalledWith(1, { checkedValue: 'yes' })
          expect(GovUkRadioGroup.yesNoItems).toHaveBeenNthCalledWith(2, { checkedValue: 'no' })

          expect(result).toEqual(
            expect.objectContaining({
              hiVisItems: radioItems,
              workedIntensivelyItems: radioItems,
              workQualityItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: false },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              behaviourItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: true },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              notes: 'note',
            }),
          )
        })

        it('should populate with null values if the contact outcome has changed from the saved appointment', () => {
          const radioItems = [{ text: 'yes', value: 'yes', checked: false }]
          jest.spyOn(GovUkRadioGroup, 'yesNoItems').mockReturnValue(radioItems)

          appointment = appointmentFactory.build({
            attendanceData: { hiVisWorn: null, workedIntensively: true, workQuality: 'GOOD', behaviour: 'EXCELLENT' },
            notes: 'some note',
          })

          page = new CompliancePage('completed', formId, {}, contactOutcomeCode)
          const result = page.viewData(appointment)

          expect(GovUkRadioGroup.yesNoItems).toHaveBeenNthCalledWith(1, { checkedValue: null })
          expect(GovUkRadioGroup.yesNoItems).toHaveBeenNthCalledWith(2, { checkedValue: null })

          expect(result).toEqual(
            expect.objectContaining({
              hiVisItems: radioItems,
              workedIntensivelyItems: radioItems,
              workQualityItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: false },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              behaviourItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: false },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              notes: null,
            }),
          )
        })

        it('should populate with appointment values and null notes if query does not exist and contact outcome matches the saved appointment', () => {
          const radioItems = [{ text: 'yes', value: 'yes', checked: true }]
          jest.spyOn(GovUkRadioGroup, 'yesNoItems').mockReturnValue(radioItems)

          appointment = appointmentFactory.build({
            attendanceData: { hiVisWorn: null, workedIntensively: true, workQuality: 'GOOD', behaviour: 'EXCELLENT' },
            notes: 'some note',
          })

          page = new CompliancePage('completed', formId, {}, appointment.contactOutcomeCode)
          const result = page.viewData(appointment)

          expect(GovUkRadioGroup.yesNoItems).toHaveBeenNthCalledWith(1, { checkedValue: null })
          expect(GovUkRadioGroup.yesNoItems).toHaveBeenNthCalledWith(2, { checkedValue: 'yes' })

          expect(result).toEqual(
            expect.objectContaining({
              hiVisItems: radioItems,
              workedIntensivelyItems: radioItems,
              workQualityItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: true },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              behaviourItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: true },
                { text: 'Good', value: 'GOOD', checked: false },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              notes: null,
            }),
          )
        })
      })
    })
  })

  describe('validate', () => {
    const action = 'completed'
    describe('when hiVis is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, formId, { hiVis: null }, contactOutcomeCode)
        page.validate()

        expect(page.validationErrors.hiVis).toEqual({
          text: 'Select yes if they wore hi-vis',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when workedIntensively is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, formId, { workedIntensively: null }, contactOutcomeCode)
        page.validate()

        expect(page.validationErrors.workedIntensively).toEqual({
          text: 'Select yes if they are working intensively',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when workQuality is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, formId, { workQuality: null }, contactOutcomeCode)
        page.validate()

        expect(page.validationErrors.workQuality).toEqual({
          text: 'Select a description of the quality of their work ',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when behaviour is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, formId, { behaviour: null }, contactOutcomeCode)
        page.validate()

        expect(page.validationErrors.behaviour).toEqual({
          text: 'Select a description of their behaviour ',
        })
        expect(page.hasErrors).toBe(true)
      })
    })
  })

  describe('next', () => {
    it.each(['completed', 'leftEarly'])('should return confirm page link', (action: AppointmentCompletedAction) => {
      const appointmentId = '1'
      const projectCode = '2'
      page = new CompliancePage(action, formId, {}, contactOutcomeCode)

      expect(page.nextPath(projectCode, appointmentId)).toBe(
        paths.appointments.confirm[action]({ projectCode, appointmentId }),
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

      page = new CompliancePage(action, formId, query, contactOutcomeCode)

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

      page = new CompliancePage(action, formId, query, contactOutcomeCode)

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

    it('saves the given contactOutcomeCode', () => {
      page = new CompliancePage(action, formId, {}, 'code')

      const result = page.requestBody(appointment)

      expect(result.contactOutcomeCode).toEqual('code')
    })
  })

  describe('completedStatus', () => {
    it.each([
      ['Session complete', 'completed'],
      ['Left site', 'leftEarly'],
    ])('returns "%s" status if action is "%s"', (status: AppointmentStatusType, action: AppointmentCompletedAction) => {
      page = new CompliancePage(action, formId, {}, contactOutcomeCode)

      expect(page.completedStatus()).toEqual(status)
    })
  })
})
