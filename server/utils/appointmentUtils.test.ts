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
      ['Completed', 'blue'],
      ['Not expected', 'red'],
    ])('Maps status to a Gov.UK colour', (status: AppointmentStatusType, colour: GovUkStatusTagColour) => {
      expect(AppointmentUtils.statusTagColour[status]).toEqual(colour)
    })
  })
})
