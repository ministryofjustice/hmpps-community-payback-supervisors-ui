import { AppointmentStatusType, GovUkStatusTagColour } from '../@types/user-defined'
import AppointmentUtils from './appointmentUtils'

describe('AppointmentUtils', () => {
  describe('getStatusTagViewData', () => {
    const status = 'Scheduled'

    expect(AppointmentUtils.getStatusTagViewData(status)).toEqual({
      text: status,
      classes: 'govuk-tag--grey',
    })
  })

  describe('getStatusTagColour', () => {
    it.each([
      ['Scheduled', 'grey'],
      ['Working', 'green'],
      ['Session complete', 'blue'],
      ['Not expected', 'red'],
      ['Absent', 'yellow'],
      ['Cannot work', 'purple'],
      ['Left site', 'orange'],
    ])('Maps status to a Gov.UK colour', (status: AppointmentStatusType, colour: GovUkStatusTagColour) => {
      expect(AppointmentUtils.statusTagColour[status]).toEqual(colour)
    })
  })

  describe('isSessionComplete', () => {
    it.each(['Session complete', 'Absent', 'Cannot work', 'Left site'])(
      'should be true if status is "%s"',
      (status: AppointmentStatusType) => {
        const result = AppointmentUtils.isSessionComplete(status)

        expect(result).toBe(true)
      },
    )

    it.each(['Scheduled', 'Not expected', 'Working'])(
      'should be false if status is "%s"',
      (status: AppointmentStatusType) => {
        const result = AppointmentUtils.isSessionComplete(status)

        expect(result).toBe(false)
      },
    )
  })
})
