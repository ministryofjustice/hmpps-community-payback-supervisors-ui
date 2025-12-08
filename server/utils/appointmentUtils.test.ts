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
    ])('Maps status to a Gov.UK colour', (status: AppointmentStatusType, colour: GovUkStatusTagColour) => {
      expect(AppointmentUtils.statusTagColour[status]).toEqual(colour)
    })
  })
})
